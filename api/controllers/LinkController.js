import { z } from 'zod'
import { prisma } from '../utils/prisma.js'

const urlSchema = z.string().url()
const API_URL = "https://short-url-azure.vercel.app/api/url"

export class LinkController {
    static async index(req, res){
       try {
         const { user } = req.session
         if (!user) return res.status(500).json({error: "Acceso no autorizado"})
         const URLs = await prisma.link.findMany({
             where: {
                 userId: user.id
             }
         })
        
         return res.json({message: "Ok", URLs})
       } catch (error) {
         return res.status(500).json({error: "Ha ocurrido un error"})
       }
    }

    static async find(req, res){
        const { id } = req.params
        const parseId = parseInt(id)
        const url = await prisma.link.findFirst({
            where: {
                id: parseId
            }
        })

        const updatedURL = await prisma.link.update({
            where: {
                id: parseId
            },
            data: {
                clicks: `${parseInt(url.clicks) + 1}`
            }
        })
        if (!url) return res.redirect('http') // TODO: PAGINA 404
        return res.redirect(url.url)
    }
    static async create(req, res){
        const { user } = req.session
        const userId = user ? user.id : "0"
        const { url } = req.body
        const results = urlSchema.safeParse(url)
        if (results.error) return res.status(500).json({error: "Ingrese una url válida", results})

        try {
            const shortURL = await prisma.link.create({
                    data: {
                        userId: userId,
                        url: results.data
                    }
                })
            if (shortURL) return res.json({message: "URL acortada con éxito", url: `${API_URL}/${shortURL.id}`, original: shortURL.url, id: shortURL.id})
        } catch (error) {
            return res.status(500).json({error: "Ha ocurrido un error", error: error})
        }
        }

        static async delete(req, res){
            try {
                const { user } = req.session
                if (!user) return res.status(500).json({error: "Acceso no autorizado"})
                const { id } = req.params
                const deletedURL = await prisma.link.delete({
                    where: {
                        id: parseInt(id),
                        userId: user.id
                    }
                })
                return res.json({message: "URL acortada eliminada con éxito"})
            } catch (error) {
                return res.status(500).json({error: "Ha ocurrido un error al eliminar la URL"})
            }
        }

}