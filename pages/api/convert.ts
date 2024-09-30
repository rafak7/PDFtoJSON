import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'
import pdf from 'pdf-parse'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' })
  }

  const { file } = req.body
  const pdfBuffer = Buffer.from(file, 'base64')

  try {
    const data = await pdf(pdfBuffer)
    const text = data.text

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Converta o seguinte texto para um JSON estruturado:\n\n${text}` }],
    })

    const jsonResponse = response.choices[0]?.message?.content?.trim() ?? ''

    res.status(200).json({ json: jsonResponse })
  } catch (error) {
    console.error('Error processing PDF:', error)
    res.status(500).json({ error: 'Error processing the PDF' })
  }
}
