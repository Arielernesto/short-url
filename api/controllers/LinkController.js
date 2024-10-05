import { z } from 'zod'
import { prisma } from '../utils/prisma.js'

const urlSchema = z.string().url()
const API_URL = "http://localhost:5000/api/url"

export class LinkController {
    static async index(req, res){
        res.json({message: "Hola Mundo"})
    }

    static async find(req, res){
        const { id } = req.params
        console.log(req.params)
        const parseId = parseInt(id)
        const url = await prisma.link.findFirst({
            where: {
                id: parseId
            }
        })
        if (!url) return res.redirect('http')
        return res.redirect(url.url)
    }
    static async create(req, res){
        const { user } = req.session
        const userId = user.id ?? "0"
        const { url } = req.body
        const results = urlSchema.safeParse(url)
        if (results.error) return res.status(500).json({error: "Ingrese una url válida"})
        
        try {
            console.log(results.data)
            const shortURL = await prisma.link.create({
                    data: {
                        userId: userId,
                        url: results.data
                    }
                })
            if (shortURL) return res.json({message: "URL acortada con éxito", url: `${API_URL}/${shortURL.id}`})
        } catch (error) {
            return res.status(500).json({error: "Ha ocurrido un error", error: error})
        }
        }

        static async delete(req, res){
            try {
                const { user } = req.session
                if (!user) return res.status(500).json({error: "Acceso no autorizado"})
                const { id } = req.body
                const deletedURL = await prisma.link.delete({
                    where: {
                        id: id,
                        userId: user.id
                    }
                })
                return res.json({message: "URL acortada eliminada con éxito"})
            } catch (error) {
                return res.status(500).json({error: "Ha ocurrido un error al elimianr la URL"})
            }
        }

}