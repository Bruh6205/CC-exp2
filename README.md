# Hospital Management System

A modern web-based hospital management system built with HTML, CSS, JavaScript, and Firebase.

## Features

- **Patient Management**: Add, view, and delete patient records
- **Appointment Booking**: Schedule appointments with doctors
- **Doctor Directory**: View available doctors and their specializations
- **Dashboard**: Overview of hospital operations and analytics
- **Real-time Data**: Uses Firebase Firestore for real-time data synchronization
- **Offline Fallback**: Uses localStorage when Firebase is not available

## Setup Instructions

### 1. Firebase Configuration

To use Firebase features, you need to configure your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project `cc-exp2-eea60`
3. Go to Project Settings → Your apps → Web apps
4. Copy the Firebase configuration object
5. Edit `public/config.js` and replace the placeholder values:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "your-actual-api-key",
  authDomain: "cc-exp2-eea60.firebaseapp.com",
  projectId: "cc-exp2-eea60",
  storageBucket: "cc-exp2-eea60.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
}
```

### 2. Firestore Rules

Make sure your Firestore rules allow read/write access. In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Running the Application

1. **Local Development Server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Access the application**: Open `http://localhost:8000` in your browser

## Usage

### Adding Patients
1. Click "Add New Patient" button
2. Fill in the patient details:
   - Full Name (required)
   - Age (required, 0-150)
   - Phone Number (required)
   - Medical History (optional)
3. Click "Add Patient"

### Viewing Patients
1. Click "Patients" in the navigation or "View patients" card
2. View all registered patients with their details
3. Delete patients using the "Delete Patient" button

### Booking Appointments
1. Click "Book Appointment" button
2. Select a patient from the dropdown
3. Choose a doctor and time slot
4. Select date and time
5. Click "Book Appointment"

### Viewing Dashboard
1. Click "View analytics" card
2. See total patients and appointments count
3. View system status

## Troubleshooting

### Common Issues

1. **"Firebase not configured" message**:
   - Check if `public/config.js` has proper Firebase configuration
   - Verify API keys are correct

2. **"Error adding patient"**:
   - Check browser console for detailed error messages
   - Ensure Firestore rules allow write access
   - System will fallback to localStorage if Firebase fails

3. **Patients not showing**:
   - Check if data is saved in Firebase or localStorage
   - Look at browser console for errors
   - Try refreshing the page

### Debug Information

The application shows system status on the main page:
- **Green**: Firebase connected and working
- **Yellow**: Using localStorage fallback
- **Red**: System error

### Browser Console

Open browser developer tools (F12) and check the Console tab for detailed error messages and system logs.

## File Structure

```
├── index.html          # Main application page
├── app.js             # Main application logic
├── public/
│   ├── config.js      # Firebase configuration
│   └── index.html     # Alternative entry point
├── firebase.json      # Firebase hosting configuration
├── firestore.rules    # Firestore security rules
└── README.md          # This file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Fallback Storage**: Browser localStorage
- **Icons**: Font Awesome (via CDN)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is for educational purposes.

