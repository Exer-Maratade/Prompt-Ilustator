import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 8787)

app.use(cors())
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ limit: '25mb', extended: true }))

function buildSystemInstruction(outputLanguage, mode = 'illustrator') {
  const languageInstruction =
    outputLanguage === 'en'
      ? 'Write in English.'
      : 'Tulis dalam bahasa Indonesia yang natural dan profesional (istilah teknis fotografi/desain seperti aspect ratio, 85mm, softbox boleh tetap bahasa Inggris jika umum).'

  if (mode === 'mockup') {
    return `You are a world-class commercial product mockup and apparel photographer & prompt engineer.
Your task is to generate one final photorealistic image prompt for rendering product mockups (t-shirts, tote bags, hoodies, caps, mugs, packaging, etc.).
The prompt must describe:
1. Exact product type, fabric material, realistic folds, seams, and fit.
2. The graphic or illustration artwork printed cleanly on the designated print zone (screen print, embroidery, DTG print texture).
3. Studio lighting, soft natural shadows, camera angle (50mm / 85mm lens, f/2.8, sharp product focus).
4. Aesthetic clean environment (minimalist studio backdrop, wood surface, or worn by lifestyle model).
Output ONLY the final prompt text without markdown, headings, numbering, or code fences.
${languageInstruction}`
  }

  return `You are a world-class illustration & graphic design prompt engineer specializing in digital art, vector, anime, watercolor, pop art, and concept illustration.
Return one final prompt optimized for AI image generation models (Midjourney, Flux, Stable Diffusion, DALL-E).
The prompt must be vivid, specific, and production-ready for the desired illustration style.
Include details on line weight, coloring technique, shading, composition, and mood.
Output only the final prompt text without markdown, heading, numbering, or code fences.
${languageInstruction}`
}

function buildUserInstruction({ mode, builder, localDraftPrompt, examples, mockupConfig }) {
  const exampleBlock = examples.length
    ? examples.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : 'No examples provided.'

  if (mode === 'mockup' && mockupConfig) {
    return `Create a high-end product mockup image prompt.

Product Details:
- Product Type: ${mockupConfig.product || 'Kaos (T-shirt)'}
- Product Color: ${mockupConfig.color || 'Black'}
- Mockup Style / Scene: ${mockupConfig.scene || 'Clean studio flat-lay with subtle shadow'}
- Perspective / Camera: ${mockupConfig.camera || 'Front view eye-level, 50mm lens'}
- Lighting: ${mockupConfig.lighting || 'Soft studio light, softbox'}
- Artwork to feature: ${mockupConfig.artworkDescription || builder?.concept || builder?.subject || 'Custom graphic illustration'}
- Aspect Ratio: ${mockupConfig.aspectRatio || builder?.aspectRatio || '1:1'}

Local draft prompt:
${localDraftPrompt || '-'}

Reference examples:
${exampleBlock}

Ensure the resulting prompt yields a crisp commercial-grade mockup with natural textile folds, realistic print ink texture on the product, and clean presentation.`
  }

  return `Create a polished illustration image prompt based on the following brief.

Brief:
- Illustration Concept: ${builder.concept || '-'}
- Subject: ${builder.subject || '-'}
- Illustration / Visual Style: ${builder.style || '-'}
- Mood & Atmosphere: ${builder.mood || '-'}
- Framing / Camera: ${builder.camera || '-'}
- Lighting & Color: ${builder.lighting || '-'}
- Color Palette: ${builder.palette || '-'}
- Setting & Background: ${builder.setting || '-'}
- Special Details & Linework: ${builder.details || '-'}
- Negative constraints: ${builder.negativePrompt || '-'}
- Aspect ratio: ${builder.aspectRatio || '-'}

Local draft prompt:
${localDraftPrompt || '-'}

Reference examples:
${exampleBlock}

Ensure the prompt captures:
- Distinctive illustration linework, strokes, or vector aesthetics
- Subject placement and composition
- Vibrant or stylistic color harmony
- Negative constraints to avoid unwanted artifacts (e.g. no photorealism if cartoon/vector is requested)`
}

async function callOpenAI({ apiKey, model, systemInstruction, userInstruction }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userInstruction },
      ],
    }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'OpenAI request failed.')
  }

  const prompt = payload?.choices?.[0]?.message?.content?.trim()
  if (!prompt) throw new Error('OpenAI response is empty.')

  return prompt
}

async function callClaude({ apiKey, model, systemInstruction, userInstruction }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      system: systemInstruction,
      messages: [{ role: 'user', content: userInstruction }],
    }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Claude request failed.')
  }

  const prompt = payload?.content?.[0]?.text?.trim()
  if (!prompt) throw new Error('Claude response is empty.')

  return prompt
}

async function callGemini({ apiKey, model, systemInstruction, userInstruction }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userInstruction }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    },
  )

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Gemini request failed.')
  }

  const prompt = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!prompt) throw new Error('Gemini response is empty.')

  return prompt
}

// Vision API functions for Image-to-Prompt
async function callOpenAIVision({ apiKey, model, systemInstruction, userInstruction, imageBase64 }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemInstruction },
        {
          role: 'user',
          content: [
            { type: 'text', text: userInstruction },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
                detail: 'high',
              },
            },
          ],
        },
      ],
    }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload?.error?.message || 'OpenAI Vision request failed.')
  }

  const raw = payload?.choices?.[0]?.message?.content?.trim()
  if (!raw) throw new Error('OpenAI Vision returned empty response.')
  return raw
}

async function callClaudeVision({ apiKey, model, systemInstruction, userInstruction, imageBase64 }) {
  const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  const mediaType = match ? match[1] : 'image/jpeg'
  const data = match ? match[2] : imageBase64

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      system: systemInstruction,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data,
              },
            },
            {
              type: 'text',
              text: userInstruction,
            },
          ],
        },
      ],
    }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Claude Vision request failed.')
  }

  const raw = payload?.content?.[0]?.text?.trim()
  if (!raw) throw new Error('Claude Vision returned empty response.')
  return raw
}

async function callGeminiVision({ apiKey, model, systemInstruction, userInstruction, imageBase64 }) {
  const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  const mimeType = match ? match[1] : 'image/jpeg'
  const data = match ? match[2] : imageBase64

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data,
                },
              },
              {
                text: userInstruction,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      }),
    },
  )

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload?.error?.message || 'Gemini Vision request failed.')
  }

  const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!raw) throw new Error('Gemini Vision returned empty response.')
  return raw
}

function parseVisionJsonResponse(rawText) {
  try {
    // If wrapped in ```json ... ```
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '')
      .trim()
    return JSON.parse(cleaned)
  } catch {
    // Fallback if model returned plain string
    return {
      prompt: rawText,
      breakdown: {
        concept: '',
        subject: '',
        style: '',
        mood: '',
        camera: '',
        lighting: '',
        palette: '',
        setting: '',
        details: '',
        negativePrompt: '',
        aspectRatio: '1:1',
      },
    }
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'prompt-studio-api' })
})

app.post('/api/generate', async (req, res) => {
  try {
    const {
      provider,
      model,
      apiKey,
      builder,
      localDraftPrompt,
      examples,
      outputLanguage,
      mode = 'illustrator',
      mockupConfig,
    } = req.body ?? {}

    if (!provider || !model || !apiKey) {
      return res.status(400).json({ error: 'provider, model, dan apiKey wajib diisi.' })
    }

    if (mode !== 'mockup' && !builder) {
      return res.status(400).json({ error: 'builder wajib diisi.' })
    }

    const systemInstruction = buildSystemInstruction(outputLanguage, mode)
    const userInstruction = buildUserInstruction({
      mode,
      builder: builder || {},
      localDraftPrompt,
      examples: Array.isArray(examples) ? examples.slice(0, 10) : [],
      mockupConfig,
    })

    let prompt = ''

    if (provider === 'chatgpt') {
      prompt = await callOpenAI({ apiKey, model, systemInstruction, userInstruction })
    } else if (provider === 'claude') {
      prompt = await callClaude({ apiKey, model, systemInstruction, userInstruction })
    } else if (provider === 'gemini') {
      prompt = await callGemini({ apiKey, model, systemInstruction, userInstruction })
    } else {
      return res.status(400).json({ error: 'Provider tidak dikenali.' })
    }

    return res.json({ prompt })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.'
    return res.status(500).json({ error: message })
  }
})

app.post('/api/image-to-prompt', async (req, res) => {
  try {
    const {
      provider,
      model,
      apiKey,
      imageBase64,
      outputLanguage = 'en',
      targetGenerator = 'midjourney',
    } = req.body ?? {}

    if (!provider || !model || !apiKey) {
      return res.status(400).json({ error: 'provider, model, dan apiKey wajib diisi.' })
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'File gambar wajib diunggah.' })
    }

    const languageInstruction =
      outputLanguage === 'id'
        ? 'Tulis prompt utama dan field breakdown dalam Bahasa Indonesia (parameter teknis AI seperti --ar, 85mm, softbox boleh tetap standar).'
        : 'Write the prompt and breakdown in English.'

    const systemInstruction = `You are an elite AI Art Director, Computer Vision analyst, and Image Prompt Engineer.
Your task is to analyze the user's provided reference image in detail and reverse-engineer it into:
1. A master-quality, vivid, highly-detailed prompt tailored for ${
      targetGenerator === 'midjourney' ? 'Midjourney v6 / Flux / Stable Diffusion' : 'AI image generation'
    } that can accurately recreate the artwork's subject, art medium, lighting, linework, color palette, camera framing, and aesthetic.
2. A structured breakdown of the image's attributes for the builder.

Return ONLY a valid JSON object with the following schema:
{
  "prompt": "Full detailed prompt string ready to copy and paste...",
  "breakdown": {
    "concept": "Core concept summary",
    "subject": "Main character, object, or subject details",
    "style": "Exact artistic medium and style (e.g. flat vector, anime cel-shading, vintage woodcut, oil painting, 3d isometric clay)",
    "mood": "Atmosphere and emotional tone",
    "camera": "Composition, perspective, framing, lens angle",
    "lighting": "Lighting setup, highlights, shadows, color temperature",
    "palette": "Dominant color palette and accent tones",
    "setting": "Background environment and scenery",
    "details": "Linework weight, stroke textures, finishing details",
    "negativePrompt": "Key elements to exclude to maintain the exact style",
    "aspectRatio": "1:1"
  }
}
${languageInstruction}
No commentary, no markdown code block fences.`

    const userInstruction = `Analyze this image thoroughly. Reverse-engineer its visual DNA, artistic style, medium, lighting, composition, and subject into a precise image prompt and structured breakdown.`

    let rawResult = ''

    if (provider === 'chatgpt') {
      rawResult = await callOpenAIVision({ apiKey, model, systemInstruction, userInstruction, imageBase64 })
    } else if (provider === 'claude') {
      rawResult = await callClaudeVision({ apiKey, model, systemInstruction, userInstruction, imageBase64 })
    } else if (provider === 'gemini') {
      rawResult = await callGeminiVision({ apiKey, model, systemInstruction, userInstruction, imageBase64 })
    } else {
      return res.status(400).json({ error: 'Provider tidak dikenali.' })
    }

    const parsed = parseVisionJsonResponse(rawResult)
    return res.json(parsed)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menganalisis gambar.'
    return res.status(500).json({ error: message })
  }
})

app.listen(port, () => {
  console.log(`Prompt Studio API running on http://localhost:${port}`)
})
