// controllers/healthcareController.js
const { Op } = require('sequelize');
const { Patient, Doctor, Appointment, Prescription, MedicalRecord, LabReport, Bill } = require('../models');

// ============= PATIENTS =============
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ patient });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Patient created', patient });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create patient' });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    await patient.update(req.body);
    res.json({ message: 'Patient updated', patient });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update patient' });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    await patient.destroy();
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};

exports.getPatientMedicalHistory = async (req, res) => {
  try {
    const records = await MedicalRecord.findAll({
      where: { patientId: req.params.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medical history' });
  }
};

// ============= DOCTORS =============
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Doctor created', doctor });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create doctor' });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    await doctor.update(req.body);
    res.json({ message: 'Doctor updated', doctor });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update doctor' });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    await doctor.destroy();
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};

exports.getDoctorSchedule = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { doctorId: req.params.id },
      order: [['appointmentDate', 'ASC']]
    });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

// ============= APPOINTMENTS =============
exports.getAllAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ],
      order: [['appointmentDate', 'DESC']]
    });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ]
    });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    
    // Real-time notification
    const io = req.app.get('io');
    io.to(`doctor_${appointment.doctorId}`).emit('appointment_created', appointment);
    
    res.status(201).json({ message: 'Appointment created', appointment });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create appointment' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    await appointment.update(req.body);
    
    // Real-time notification
    const io = req.app.get('io');
    io.to(`patient_${appointment.patientId}`).emit('appointment_updated', appointment);
    
    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update appointment' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

// ============= PRESCRIPTIONS =============
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll();
    res.json({ prescriptions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json({ prescription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    res.status(201).json({ message: 'Prescription created', prescription });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create prescription' });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    await prescription.update(req.body);
    res.json({ message: 'Prescription updated', prescription });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update prescription' });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    await prescription.destroy();
    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prescription' });
  }
};

// ============= MEDICAL RECORDS =============
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.findAll();
    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
};

exports.getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    res.json({ record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medical record' });
  }
};

exports.createMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    res.status(201).json({ message: 'Medical record created', record });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create medical record' });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    await record.update(req.body);
    res.json({ message: 'Medical record updated', record });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update medical record' });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    await record.destroy();
    res.json({ message: 'Medical record deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
};

// ============= LAB REPORTS =============
exports.getAllLabReports = async (req, res) => {
  try {
    const reports = await LabReport.findAll();
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lab reports' });
  }
};

exports.getLabReportById = async (req, res) => {
  try {
    const report = await LabReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Lab report not found' });
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lab report' });
  }
};

exports.createLabReport = async (req, res) => {
  try {
    const report = await LabReport.create(req.body);
    res.status(201).json({ message: 'Lab report created', report });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create lab report' });
  }
};

exports.updateLabReport = async (req, res) => {
  try {
    const report = await LabReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Lab report not found' });
    await report.update(req.body);
    res.json({ message: 'Lab report updated', report });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update lab report' });
  }
};

// ============= BILLS =============
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.findAll();
    res.json({ bills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json({ bill });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
};

exports.createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json({ message: 'Bill created', bill });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create bill' });
  }
};

exports.payBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    bill.status = 'paid';
    bill.paidDate = new Date();
    await bill.save();
    res.json({ message: 'Bill paid successfully', bill });
  } catch (error) {
    res.status(400).json({ error: 'Failed to pay bill' });
  }
};