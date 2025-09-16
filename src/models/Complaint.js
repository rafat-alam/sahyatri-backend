import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    zoneName: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    filedBy: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Submitted', 'In Review', 'Resolved'],
        default: 'Submitted',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;