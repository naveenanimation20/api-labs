// routes/healthcareRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

const {
  patientValidation,
  doctorValidation,
  appointmentValidation,
  prescriptionValidation
} = require('../middleware/validators');


const {
  // Patients
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientMedicalHistory,
  // Doctors
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorSchedule,
  // Appointments
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  // Prescriptions
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  // Medical Records
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  // Lab Reports
  getAllLabReports,
  getLabReportById,
  createLabReport,
  updateLabReport,
  // Bills
  getAllBills,
  getBillById,
  createBill,
  payBill
} = require('../controllers/healthcareController');

// ============= PATIENTS ROUTES =============

/**
 * @swagger
 * /api/v1/healthcare/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Healthcare - Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get('/patients', authenticate, getAllPatients);
router.head('/patients', authenticate, getAllPatients);

router.get('/patients/:id', authenticate, getPatientById);
router.post('/patients', authenticate, patientValidation, createPatient);
router.put('/patients/:id', authenticate, updatePatient);
router.patch('/patients/:id', authenticate, updatePatient);
router.delete('/patients/:id', authenticate, deletePatient);
router.get('/patients/:id/history', authenticate, getPatientMedicalHistory);
router.options('/patients', (req, res) => res.sendStatus(200));

// ============= DOCTORS ROUTES =============

router.get('/doctors', authenticate, getAllDoctors);
router.get('/doctors/:id', authenticate, getDoctorById);
router.post('/doctors', authenticate, doctorValidation, createDoctor);
router.put('/doctors/:id', authenticate, updateDoctor);
router.patch('/doctors/:id', authenticate, updateDoctor);
router.delete('/doctors/:id', authenticate, deleteDoctor);
router.get('/doctors/:id/schedule', authenticate, getDoctorSchedule);
router.options('/doctors', (req, res) => res.sendStatus(200));

// ============= APPOINTMENTS ROUTES =============

/**
 * @swagger
 * /api/v1/healthcare/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Healthcare - Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/appointments', authenticate, getAllAppointments);
router.head('/appointments', authenticate, getAllAppointments);

router.get('/appointments/:id', authenticate, getAppointmentById);
router.post('/appointments', authenticate, appointmentValidation, createAppointment);
router.put('/appointments/:id', authenticate, updateAppointment);
router.patch('/appointments/:id', authenticate, updateAppointment);
router.delete('/appointments/:id', authenticate, cancelAppointment);
router.patch('/appointments/:id/cancel', authenticate, cancelAppointment);
router.options('/appointments', (req, res) => res.sendStatus(200));

// ============= PRESCRIPTIONS ROUTES =============

router.get('/prescriptions', authenticate, getAllPrescriptions);
router.get('/prescriptions/:id', authenticate, getPrescriptionById);
router.post('/prescriptions', authenticate, prescriptionValidation, createPrescription);
router.put('/prescriptions/:id', authenticate, updatePrescription);
router.patch('/prescriptions/:id', authenticate, updatePrescription);
router.delete('/prescriptions/:id', authenticate, deletePrescription);
router.options('/prescriptions', (req, res) => res.sendStatus(200));

// ============= MEDICAL RECORDS ROUTES =============

router.get('/medical-records', authenticate, getAllMedicalRecords);
router.get('/medical-records/:id', authenticate, getMedicalRecordById);
router.post('/medical-records', authenticate, createMedicalRecord);
router.put('/medical-records/:id', authenticate, updateMedicalRecord);
router.patch('/medical-records/:id', authenticate, updateMedicalRecord);
router.delete('/medical-records/:id', authenticate, deleteMedicalRecord);
router.options('/medical-records', (req, res) => res.sendStatus(200));

// ============= LAB REPORTS ROUTES =============

router.get('/lab-reports', authenticate, getAllLabReports);
router.get('/lab-reports/:id', authenticate, getLabReportById);
router.post('/lab-reports', authenticate, createLabReport);
router.put('/lab-reports/:id', authenticate, updateLabReport);
router.patch('/lab-reports/:id', authenticate, updateLabReport);
router.options('/lab-reports', (req, res) => res.sendStatus(200));

// ============= BILLS ROUTES =============

router.get('/bills', authenticate, getAllBills);
router.get('/bills/:id', authenticate, getBillById);
router.post('/bills', authenticate, createBill);
router.post('/bills/:id/pay', authenticate, payBill);
router.options('/bills', (req, res) => res.sendStatus(200));

module.exports = router;