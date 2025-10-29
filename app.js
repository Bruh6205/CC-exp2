// Hospital Management System with Firebase

// Hospital Management System with Firebase
let db = null;
let firebaseInitialized = false;

// Firebase configuration
function initializeFirebase() {
  try {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase not loaded');
    }

    // Get config from window object (loaded from config.js)
    let firebaseConfig = null;
    
    if (typeof window !== 'undefined' && window.FIREBASE_CONFIG) {
      firebaseConfig = window.FIREBASE_CONFIG;
    } else {
      // Fallback config
      firebaseConfig = {
        apiKey: "AIzaSyC7K8L9M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z",
        authDomain: "cc-exp2-eea60.firebaseapp.com",
        projectId: "cc-exp2-eea60",
        storageBucket: "cc-exp2-eea60.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef123456789012"
      };
    }

    // Initialize Firebase
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    firebaseInitialized = true;
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.log('Firebase initialization failed - using localStorage fallback:', error.message);
    db = null;
    firebaseInitialized = false;
    return false;
  }
}

// Initialize Firebase
initializeFirebase();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('MediCare - Hospital Management System initialized');
    
    // Add event listeners
    addEventListeners();
    
    // Load any saved data
    loadSavedData();
    
});

// Add event listeners to buttons
function addEventListeners() {
    console.log('Adding event listeners...');
    
    // Add event listeners using IDs for better reliability
    const addPatientBtn = document.getElementById('add-patient-btn');
    const bookAppointmentBtn = document.getElementById('book-appointment-btn');
    
    if (addPatientBtn) {
        console.log('Adding click listener to Add Patient button');
        addPatientBtn.addEventListener('click', function(e) {
            console.log('Add Patient button clicked');
            e.preventDefault();
            showAddPatientForm();
        });
    } else {
        console.error('Add Patient button not found');
    }
    
    if (bookAppointmentBtn) {
        console.log('Adding click listener to Book Appointment button');
        bookAppointmentBtn.addEventListener('click', function(e) {
            console.log('Book Appointment button clicked');
            e.preventDefault();
            showAppointmentForm();
        });
    } else {
        console.error('Book Appointment button not found');
    }
    
    // Add click handlers for feature card links
    const cardLinks = document.querySelectorAll('a');
    cardLinks.forEach(link => {
        if (link.textContent.includes('View patients')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showPatientsList();
            });
        } else if (link.textContent.includes('Find doctors')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showDoctorsList();
            });
        } else if (link.textContent.includes('Check schedule')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showAppointmentsList();
            });
        } else if (link.textContent.includes('View analytics')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showDashboard();
            });
        }
    });
    
    console.log('Event listeners added successfully');
}

// Show add patient form
function showAddPatientForm() {
    const modal = createModal('Add New Patient', `
        <form id="addPatientForm" class="space-y-4">
            <div>
                <label class="block text-white text-sm font-medium mb-2">Full Name</label>
                <input type="text" id="patientName" placeholder="Enter patient's full name" 
                       class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div>
                <label class="block text-white text-sm font-medium mb-2">Age</label>
                <input type="number" id="patientAge" placeholder="Enter age" 
                       class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div>
                <label class="block text-white text-sm font-medium mb-2">Phone Number</label>
                <input type="tel" id="patientPhone" placeholder="Enter phone number" 
                       class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div>
                <label class="block text-white text-sm font-medium mb-2">Medical History</label>
                <textarea id="medicalHistory" rows="3" placeholder="Any existing medical conditions..." 
                          class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
            </div>
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Add Patient
                </button>
                <button type="button" onclick="closeModal()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('addPatientForm').addEventListener('submit', handleAddPatient);
}

// Show appointment booking form
function showAppointmentForm() {
    const modal = createModal('Book Appointment', `
        <form id="appointmentForm" class="space-y-4">
            <div>
                <label class="block text-white text-sm font-medium mb-2">Patient Name</label>
                <select id="appointmentPatient" class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-black focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="" class="text-black">Select patient</option>
                    ${getPatientOptions()}
                </select>
            </div>
            <div>
                <label class="block text-white text-sm font-medium mb-2">Doctor</label>
                <select id="appointmentDoctor" class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-black focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="" class="text-black">Select doctor</option>
                    <option value="dr-smith" class="text-black">Dr. Smith - Cardiology</option>
                    <option value="dr-johnson" class="text-black">Dr. Johnson - Neurology</option>
                    <option value="dr-williams" class="text-black">Dr. Williams - Pediatrics</option>
                    <option value="dr-brown" class="text-black">Dr. Brown - Orthopedics</option>
                </select>
            </div>
            <div>
                <label class="block text-white text-sm font-medium mb-2">Date</label>
                <input type="date" id="appointmentDate" 
                       class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div>
                <label class="block text-white text-sm font-medium mb-2">Time</label>
                <select id="appointmentTime" class="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-black focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="" class="text-black">Select time</option>
                    <option value="09:00" class="text-black">9:00 AM</option>
                    <option value="10:00" class="text-black">10:00 AM</option>
                    <option value="11:00" class="text-black">11:00 AM</option>
                    <option value="14:00" class="text-black">2:00 PM</option>
                    <option value="15:00" class="text-black">3:00 PM</option>
                    <option value="16:00" class="text-black">4:00 PM</option>
                </select>
            </div>
            <div class="flex gap-3">
                <button type="submit" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Book Appointment
                </button>
                <button type="button" onclick="closeModal()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointment);
}

// Get patient options for appointment form
async function getPatientOptions() {
    try {
        if (db) {
            const snapshot = await db.collection('patients').get();
            const patients = [];
            snapshot.forEach(doc => {
                patients.push({ id: doc.id, ...doc.data() });
            });
            
            if (patients.length === 0) {
                return '<option value="" class="text-black">No patients available</option>';
            }
            
            return patients.map(patient => 
                `<option value="${patient.id}" class="text-black">${patient.name} (${patient.age} years)</option>`
            ).join('');
        } else {
            // Fallback to localStorage
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            if (patients.length === 0) {
                return '<option value="" class="text-black">No patients available</option>';
            }
            
            return patients.map(patient => 
                `<option value="${patient.id}" class="text-black">${patient.name} (${patient.age} years)</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading patients:', error);
        return '<option value="" class="text-black">Error loading patients</option>';
    }
}

// Create modal
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-white/20">
            <h2 class="text-xl font-bold text-white mb-4">${title}</h2>
            ${content}
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

// Handle add patient submission
async function handleAddPatient(e) {
    e.preventDefault();
    
    // Validate form data
    const name = document.getElementById('patientName').value.trim();
    const age = parseInt(document.getElementById('patientAge').value);
    const phone = document.getElementById('patientPhone').value.trim();
    const medicalHistory = document.getElementById('medicalHistory').value.trim();
    
    if (!name) {
        showNotification('Please enter patient name', 'error');
        return;
    }
    
    if (!age || age < 0 || age > 150) {
        showNotification('Please enter a valid age', 'error');
        return;
    }
    
    if (!phone) {
        showNotification('Please enter phone number', 'error');
        return;
    }
    
    const formData = {
        name: name,
        age: age,
        phone: phone,
        medicalHistory: medicalHistory,
        timestamp: new Date().toISOString()
    };
    
    try {
        if (firebaseInitialized && db) {
            console.log('Attempting to save patient to Firebase...');
            // Save to Firebase
            const docRef = await db.collection('patients').add({
                ...formData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            showNotification('Patient added successfully to Firebase!', 'success');
            console.log('Patient added to Firebase with ID:', docRef.id);
            console.log('Patient data saved to Firebase:', formData);
        } else {
            // Fallback to localStorage
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            const newPatient = { 
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9), 
                ...formData 
            };
            patients.push(newPatient);
            localStorage.setItem('patients', JSON.stringify(patients));
            showNotification('Patient added successfully to local storage!', 'success');
            console.log('Patient added to localStorage:', newPatient);
        }
        
        // Close modal
        closeModal();
        
        // Show success and refresh
        setTimeout(() => {
            showPatientsList();
        }, 1000);
        
    } catch (error) {
        console.error('Error adding patient:', error);
        showNotification('Error adding patient: ' + error.message, 'error');
    }
}

// Handle appointment submission
async function handleAppointment(e) {
    e.preventDefault();
    
    const formData = {
        patientId: document.getElementById('appointmentPatient').value,
        doctor: document.getElementById('appointmentDoctor').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'scheduled'
    };
    
    try {
        // Save to Firebase
        await db.collection('appointments').add(formData);
        
        // Show success message
        showNotification('Appointment booked successfully in Firebase!', 'success');
        
        // Close modal
        closeModal();
    } catch (error) {
        console.error('Error booking appointment:', error);
        showNotification('Error booking appointment. Please try again.', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    let bgColor = 'bg-blue-500';
    
    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            break;
        default:
            bgColor = 'bg-blue-500';
    }
    
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 ${bgColor} shadow-lg`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Load saved data
async function loadSavedData() {
    try {
        if (firebaseInitialized && db) {
            // Load from Firebase
            const patientsSnapshot = await db.collection('patients').get();
            const appointmentsSnapshot = await db.collection('appointments').get();
            console.log(`Loaded ${patientsSnapshot.size} patients and ${appointmentsSnapshot.size} appointments from Firebase`);
        } else {
            // Load from localStorage
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            console.log(`Loaded ${patients.length} patients and ${appointments.length} appointments from localStorage`);
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}


// Show patients list
async function showPatientsList() {
    try {
        let patients = [];
        let dataSource = 'local storage';
        
        if (firebaseInitialized && db) {
            try {
                console.log('Attempting to load patients from Firebase...');
                // Load from Firebase
                const snapshot = await db.collection('patients').get();
                console.log('Firebase snapshot received:', snapshot.size, 'documents');
                
                snapshot.forEach(doc => {
                    const patientData = { id: doc.id, ...doc.data() };
                    patients.push(patientData);
                    console.log('Firebase patient loaded:', patientData);
                });
                dataSource = 'Firebase';
                console.log('Successfully loaded', patients.length, 'patients from Firebase');
            } catch (firebaseError) {
                console.error('Firebase error, falling back to localStorage:', firebaseError);
                showNotification('Firebase error: ' + firebaseError.message, 'error');
                firebaseInitialized = false;
                // Fall through to localStorage
            }
        }
        
        if (!firebaseInitialized || patients.length === 0) {
            // Load from localStorage
            patients = JSON.parse(localStorage.getItem('patients') || '[]');
            dataSource = 'local storage';
        }
        
        const modal = createModal('Patient List', `
            <div class="space-y-4 text-white">
                <div class="text-center mb-4">
                    <p class="text-sm text-white/60">Loading from ${dataSource}</p>
                    <p class="text-xs text-white/50">Total patients: ${patients.length}</p>
                </div>
                ${patients.length === 0 ? 
                    '<p class="text-center text-white/60">No patients added yet</p>' :
                    patients.map(patient => `
                        <div class="bg-white/10 rounded-lg p-4">
                            <h3 class="font-semibold">${patient.name || 'Unknown'}</h3>
                            <p class="text-sm text-white/80">Age: ${patient.age || 'N/A'} | Phone: ${patient.phone || 'N/A'}</p>
                            <p class="text-xs text-white/60">Medical History: ${patient.medicalHistory || 'None recorded'}</p>
                            <p class="text-xs text-green-300">Added: ${formatTimestamp(patient.timestamp)}</p>
                            <div class="mt-3 text-right">
                                <button onclick="deletePatient('${patient.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                                    Delete Patient
                                </button>
                            </div>
                        </div>
                    `).join('')
                }
                <div class="text-center">
                    <button onclick="closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error loading patients:', error);
        showNotification('Error loading patients: ' + error.message, 'error');
    }
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    try {
        if (!timestamp) return 'N/A';
        if (typeof timestamp.toDate === 'function') {
            return new Date(timestamp.toDate()).toLocaleDateString();
        }
        return new Date(timestamp).toLocaleDateString();
    } catch (error) {
        return 'N/A';
    }
}

// Show doctors list
function showDoctorsList() {
    const modal = createModal('Available Doctors', `
        <div class="space-y-4 text-white">
            <div class="bg-white/10 rounded-lg p-4">
                <h3 class="font-semibold">Dr. Smith</h3>
                <p class="text-sm text-white/80">Cardiology Specialist</p>
                <p class="text-xs text-green-300">Available: Mon-Fri, 9 AM - 5 PM</p>
            </div>
            <div class="bg-white/10 rounded-lg p-4">
                <h3 class="font-semibold">Dr. Johnson</h3>
                <p class="text-sm text-white/80">Neurology Specialist</p>
                <p class="text-xs text-green-300">Available: Mon-Thu, 10 AM - 6 PM</p>
            </div>
            <div class="bg-white/10 rounded-lg p-4">
                <h3 class="font-semibold">Dr. Williams</h3>
                <p class="text-sm text-white/80">Pediatrics Specialist</p>
                <p class="text-xs text-green-300">Available: Mon-Sat, 8 AM - 4 PM</p>
            </div>
            <div class="bg-white/10 rounded-lg p-4">
                <h3 class="font-semibold">Dr. Brown</h3>
                <p class="text-sm text-white/80">Orthopedics Specialist</p>
                <p class="text-xs text-green-300">Available: Tue-Sat, 9 AM - 7 PM</p>
            </div>
            <div class="text-center">
                <button onclick="closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Close
                </button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Show appointments list
async function showAppointmentsList() {
    try {
        const snapshot = await db.collection('appointments').get();
        const appointments = [];
        snapshot.forEach(doc => {
            appointments.push({ id: doc.id, ...doc.data() });
        });
        
        const modal = createModal('Appointment Schedule', `
            <div class="space-y-4 text-white">
                ${appointments.length === 0 ? 
                    '<p class="text-center text-white/60">No appointments scheduled</p>' :
                    appointments.map(appointment => `
                        <div class="bg-white/10 rounded-lg p-4">
                            <h3 class="font-semibold">Appointment #${appointment.id.slice(-4)}</h3>
                            <p class="text-sm text-white/80">Date: ${appointment.date} | Time: ${appointment.time}</p>
                            <p class="text-xs text-green-300">Status: ${appointment.status}</p>
                        </div>
                    `).join('')
                }
                <div class="text-center">
                    <button onclick="closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error loading appointments:', error);
        showNotification('Error loading appointments from Firebase', 'error');
    }
}

// Delete patient function
async function deletePatient(patientId) {
    if (!patientId) {
        showNotification('Invalid patient ID', 'error');
        return;
    }
    
    const confirmed = confirm('Are you sure you want to delete this patient? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
        if (firebaseInitialized && db) {
            // Delete from Firebase
            await db.collection('patients').doc(patientId).delete();
            showNotification('Patient deleted successfully from Firebase', 'success');
        } else {
            // Delete from localStorage
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            const updatedPatients = patients.filter(patient => patient.id !== patientId);
            localStorage.setItem('patients', JSON.stringify(updatedPatients));
            showNotification('Patient deleted successfully from local storage', 'success');
        }
        
        // Close modal and refresh
        closeModal();
        setTimeout(() => {
            showPatientsList();
        }, 500);
        
    } catch (error) {
        console.error('Error deleting patient:', error);
        showNotification('Error deleting patient. Please try again.', 'error');
    }
}

// Show dashboard
async function showDashboard() {
    try {
        let patientsCount = 0;
        let appointmentsCount = 0;
        
        if (firebaseInitialized && db) {
            const patientsSnapshot = await db.collection('patients').get();
            const appointmentsSnapshot = await db.collection('appointments').get();
            patientsCount = patientsSnapshot.size;
            appointmentsCount = appointmentsSnapshot.size;
        } else {
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            patientsCount = patients.length;
            appointmentsCount = appointments.length;
        }
        
        const modal = createModal('Hospital Dashboard', `
            <div class="space-y-4 text-white">
                <div class="text-center mb-4">
                    <p class="text-sm text-white/60">${firebaseInitialized ? 'Data from Firebase' : 'Data from local storage'}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                        <h3 class="text-2xl font-bold text-green-300">${patientsCount}</h3>
                        <p class="text-sm">Total Patients</p>
                    </div>
                    <div class="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                        <h3 class="text-2xl font-bold text-blue-300">${appointmentsCount}</h3>
                        <p class="text-sm">Total Appointments</p>
                    </div>
                </div>
                <div class="bg-white/10 rounded-lg p-4">
                    <h3 class="font-semibold mb-2">System Status</h3>
                    <p class="text-sm text-white/80">${firebaseInitialized ? 'Connected to Firebase' : 'Using local storage fallback'}</p>
                    <p class="text-xs text-green-300">Last updated: ${new Date().toLocaleString()}</p>
                </div>
                <div class="text-center">
                    <button onclick="closeModal()" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard. Please try again.', 'error');
    }
}

// Test function to add sample data
function addSampleData() {
    const samplePatients = [
        {
            id: 'sample1',
            name: 'John Doe',
            age: 35,
            phone: '555-0123',
            medicalHistory: 'No known allergies',
            timestamp: new Date().toISOString()
        },
        {
            id: 'sample2',
            name: 'Jane Smith',
            age: 28,
            phone: '555-0456',
            medicalHistory: 'Diabetes type 2',
            timestamp: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('patients', JSON.stringify(samplePatients));
    showNotification('Sample data added to local storage', 'success');
}

// Expose test functions to window
window.addSampleData = addSampleData;

