import jwt from 'jsonwebtoken'
import z from 'zod'
import { prisma } from '../utils/prisma.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const TOKEN = process.env.TOKEN


export class AuthController{
    static async authorize(req, res, next){
        const token = req.cookies.access_token
        req.session = { user: null}
        try {
            const data = jwt.verify(token, TOKEN)
            req.session.user = data
        } catch {}
        next()
    }

    static async session(req, res){
        const { user } = req.session
        if (!user) return res.json({auth: false, isAuth: "500"})
        const { name, email, profile_photo, id} = user
        return res.json({name, email, profile_photo, id , auth: true})
    }

    static async login(req, res){
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(401).json({error: "Por favor ingrese todos los datos"})
        }
        try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(401).json({error: "La cuenta no existe"})
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({error: "Contraseña incorrecta"})
        }
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name , profile_photo: user.profile_photo, password: user.password}, TOKEN, {
                expiresIn: '24h'
        })

        return res
        .cookie('access_token', token, {
            httpOnly: true,
        })
        .send({username: user.name, email: user.email, profile_photo: user.profile_photo, auth: "ok"})
        } catch (error) {
        return res.status(400).json({error: "Error al iniciar sesión"})
        }
    }

    static async register(req, res){
        try {
            const {email, password, name} = req.body
            const userSchema = z.object({
                name: z.string().min(3),
                email: z.string().email(),
                password: z.string().min(6)
            })
            const results = userSchema.safeParse({name, email, password})
            if (results.error) {
                return res.status(401).json({error: "Ha ocurrido un error"})
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await prisma.user.create({
                data: {
                    name: name,
                    profile_photo: "",
                    email: email,
                    password: hashedPassword
                }
            })

            const token = jwt.sign({ id: user.id, email: user.email, name: user.name , profile_photo: user.profile_photo, password: user.password}, TOKEN, {
                expiresIn: '24h'
            })


            return res
            .cookie('access_token', token, {
                httpOnly: true,
            })
            .send({username: user.name, email: user.email, profile_photo: user.profile_photo, auth: "ok"})
        } catch (error) {
            if (error.code == "P2002") {
                return res.status(500).json({error: "El email ingresado ya existe"})
            }
            return res.status(401).json({error: "Ha ocurrido un error al registrarse", error})
        }
        

    }

    static async logout(req, res) {  
        const { user } = req.session
        if (!user) return res.json({error: "acción no autorizada"})
        res.clearCookie('access_token').json({message: 'Usted ha cerrado sesión con éxito', auth: false})       
    }
}