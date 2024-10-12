import z from 'zod'

export const userSchema = z.object({
    name: z.string(
        { 
            message: "El nombre debe ser un string"
        })
        .min(2, {message: "El nombre debe tener como minimo dos caracteres"})
        .max(15, {message: "El nombre debe tener como maximo 15 caracteres"}),
    email: z.string({
        message: "El email debe ser un string"
    }).email({
        message: "Email Inválido"
    }),
    password: z.string({
        message: "La contraseña debe ser un string"
    }).min(6, {
        message: "La contraseña debe tener como minimo 6 caracteres"
    })
})