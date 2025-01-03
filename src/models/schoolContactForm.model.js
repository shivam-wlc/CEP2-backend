import mongoose from 'mongoose';

const schoolContactFormSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index for faster query lookup
    },
    contactPerson1: {
      firstName: {
        type: String,
        default: '',
        trim: true,
      },
      middleName: {
        type: String,
        default: '',
        trim: true,
      },
      lastName: {
        type: String,
        default: '',
        trim: true,
      },
      position: {
        type: String,
        default: '',
        trim: true,
      },
      email: {
        type: String,
        default: '',
        trim: true,
        lowercase: true,
        // match: [/.+@.+\..+/, 'Please enter a valid email address'], // Email validation
      },
      phoneNumber: {
        type: String,
        default: '',
        trim: true,
        // match: [/^\d{10,15}$/, 'Please enter a valid phone number'], // Phone validation
      },
    },
    contactPerson2: {
      firstName: {
        type: String,
        default: '',
        trim: true,
      },
      middleName: {
        type: String,
        default: '',
        trim: true,
      },
      lastName: {
        type: String,
        default: '',
        trim: true,
      },
      position: {
        type: String,
        default: '',
        trim: true,
      },
      email: {
        type: String,
        default: '',
        trim: true,
        lowercase: true,
        // match: [/.+@.+\..+/, 'Please enter a valid email address'], // Email validation
      },
      phoneNumber: {
        type: String,
        default: '',
        trim: true,
        // match: [/^\d{10,15}$/, 'Please enter a valid phone number'], // Phone validation
      },
    },
    schoolDetails: {
      schoolName: {
        type: String,
        default: '',
        trim: true,
        index: true, // Index for faster query lookup
      },
      website: {
        type: String,
        default: '',
        trim: true,
        // match: [/^https?:\/\/.+/, 'Please enter a valid URL'], // URL validation
      },
      addressLine1: {
        type: String,
        default: '',
        trim: true,
      },
      addressLine2: {
        type: String,
        default: '',
        trim: true,
      },
      city: {
        type: String,
        default: '',
        trim: true,
      },
      postalCode: {
        type: String,
        default: '',
        trim: true,
        // match: [/^\d{4,10}$/, 'Please enter a valid postal code'], // Postal code validation
      },
      country: {
        type: String,
        default: '',
        trim: true,
        index: true, // Index for faster query lookup
      },
    },
  },
  {
    timestamps: true,
    versionKey: false, // Removes __v field
  },
);

// Compound Index for better query performance
schoolContactFormSchema.index({ 'schoolDetails.schoolName': 1, 'schoolDetails.city': 1 });

const SchoolContactForm = mongoose.model('SchoolContactForm', schoolContactFormSchema);

export default SchoolContactForm;
