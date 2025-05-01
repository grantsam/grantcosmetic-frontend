import { z } from 'zod';

export const bookingSchema = z.object({
    name: z.string().min(1,"Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1,"Phone number is required"),
    post_code: z.string().min(1,"Postcode is required"),
    address: z.string().min(1,"Address is required"),
    city: z.string().min(1,"City is required"),
});

export const paymentSchema = z.object({
    proof: z
        .instanceof(File)
        .refine((file) => file.size > 0, "Proof of payment is required"),
});

export const viewBookingSchema = z.object({
    booking_trx_id: z.string().min(1, "Booking transaction ID is required"),
    email: z.string().email("email number is required"),
});
