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

const GEMINI_FALLBACK_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.8-flash',
]

function getGeminiCandidateModels(primaryModel) {
  const normalized = (primaryModel || 'gemini-3.5-flash')
    .replace(/^models\//, '')
    // Map obsolete 2.5 / 1.5 defaults to 3.5-flash
    .replace(/^gemini-(?:2\.5|1\.5|2\.0)-flash(?:-lite)?$/, 'gemini-3.5-flash')
    .replace(/^gemini-(?:2\.5|1\.5|2\.0)-pro$/, 'gemini-3.5-flash')

  const candidates = [normalized]
  for (const fallback of GEMINI_FALLBACK_MODELS) {
    if (!candidates.includes(fallback)) {
      candidates.push(fallback)
    }
  }
  return candidates
}

async function callGemini({ apiKey, model, systemInstruction, userInstruction }) {
  const key = apiKey?.trim() || process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('API key Gemini tidak ditemukan. Masukkan API key pada pengaturan.')
  }

  const candidateModels = getGeminiCandidateModels(model)
  let lastError = null

  for (const candidate of candidateModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${key}`,
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
        const errMsg = payload?.error?.message || `Gemini API request failed (${response.status})`
        lastError = new Error(errMsg)
        if (
          response.status === 404 ||
          response.status === 503 ||
          errMsg.includes('high demand') ||
          errMsg.includes('no longer available')
        ) {
          continue
        }
        throw lastError
      }

      const prompt = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!prompt) throw new Error('Gemini response is empty.')

      return prompt
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('Gagal memanggil API Gemini.')
}

// Vision API functions for Image-to-Prompt
async function callOpenAIVision({ apiKey, model, systemInstruction, userInstruction, imageBase64, temperature = 0.5 }) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
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

async function callClaudeVision({ apiKey, model, systemInstruction, userInstruction, imageBase64, temperature = 0.5 }) {
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
      max_tokens: 1500,
      temperature,
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

async function callGeminiVision({ apiKey, model, systemInstruction, userInstruction, imageBase64, temperature = 0.4 }) {
  const key = apiKey?.trim() || process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('API key Gemini tidak ditemukan. Masukkan API key pada pengaturan.')
  }

  const match = imageBase64.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  let mimeType = match ? match[1] : 'image/jpeg'
  let data = match ? match[2] : imageBase64

  // Gemini Vision requires bitmap formats (jpeg, png, webp, heic)
  if (mimeType.includes('svg')) {
    mimeType = 'image/png'
  }

  const candidateModels = getGeminiCandidateModels(model)
  let lastError = null

  for (const candidate of candidateModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${key}`,
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
              temperature,
              responseMimeType: 'application/json',
            },
          }),
        },
      )

      const payload = await response.json()
      if (!response.ok) {
        const errMsg = payload?.error?.message || `Gemini Vision request failed (${response.status})`
        lastError = new Error(errMsg)
        if (
          response.status === 404 ||
          response.status === 503 ||
          errMsg.includes('high demand') ||
          errMsg.includes('no longer available')
        ) {
          continue
        }
        throw lastError
      }

      const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!raw) throw new Error('Gemini Vision returned empty response.')
      return raw
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('Gagal memanggil Gemini Vision API.')
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

app.get('/api/config', (_req, res) => {
  res.json({
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    chatgptConfigured: Boolean(process.env.OPENAI_API_KEY),
    claudeConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
  })
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

    const resolvedApiKey =
      apiKey?.trim() ||
      (provider === 'gemini'
        ? process.env.GEMINI_API_KEY
        : provider === 'chatgpt'
          ? process.env.OPENAI_API_KEY
          : process.env.ANTHROPIC_API_KEY)

    if (!provider || !model || !resolvedApiKey) {
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
      prompt = await callOpenAI({ apiKey: resolvedApiKey, model, systemInstruction, userInstruction })
    } else if (provider === 'claude') {
      prompt = await callClaude({ apiKey: resolvedApiKey, model, systemInstruction, userInstruction })
    } else if (provider === 'gemini') {
      prompt = await callGemini({ apiKey: resolvedApiKey, model, systemInstruction, userInstruction })
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
      promptStrategy = 'detailed',
      creativityLevel = 'balanced',
      aspectRatioOverride = 'auto',
      customFocus = '',
    } = req.body ?? {}

    const resolvedApiKey =
      apiKey?.trim() ||
      (provider === 'gemini'
        ? process.env.GEMINI_API_KEY
        : provider === 'chatgpt'
          ? process.env.OPENAI_API_KEY
          : process.env.ANTHROPIC_API_KEY)

    if (!provider || !model || !resolvedApiKey) {
      return res.status(400).json({ error: 'provider, model, dan apiKey wajib diisi.' })
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'File gambar wajib diunggah.' })
    }

    // Determine temperature based on creativity level
    let temp = 0.5
    if (creativityLevel === 'strict') temp = 0.2
    else if (creativityLevel === 'creative') temp = 0.85

    const languageInstruction =
      outputLanguage === 'id'
        ? 'Tulis prompt utama dan field breakdown dalam Bahasa Indonesia (parameter teknis AI seperti --ar, 85mm, softbox boleh tetap standar bahasa Inggris jika umum).'
        : 'Write the prompt and breakdown in English.'

    // Strategy guidance tailored to user choice
    let strategyInstruction = ''
    switch (promptStrategy) {
      case 'concise':
        strategyInstruction = `Strategy: PUNCHY & CONCISE.
Focus on high-density comma-separated keywords and essential style descriptors. Avoid verbose narrative filler. Perfect for quick generation in Midjourney/SDXL.`
        break
      case 'creative-remix':
        strategyInstruction = `Strategy: CREATIVE REMIX & EXPANSION.
Capture the visual essence of the artwork, then creatively elevate and remix the concept with cinematic depth, dynamic atmospheric details, and imaginative storytelling nuances while preserving its aesthetic core.`
        break
      case 'merch-apparel':
        strategyInstruction = `Strategy: APPAREL & MERCHANDISE VECTOR READY.
Tailor the prompt specifically for t-shirt graphics, screen-printing, and die-cut stickers. Emphasize bold vector linework, clean solid contours, high-contrast ink separation, vibrant color palette, and isolated clean background (ready for mockup placement).`
        break
      case 'photorealistic':
        strategyInstruction = `Strategy: PHOTOREALISTIC CONVERSION.
Transform the concept in the image into an ultra-realistic commercial photography shoot. Specify camera gear (85mm or 50mm f/1.8 lens), studio or cinematic lighting, authentic textures, micro-details, and realistic depth of field.`
        break
      case 'anime-stylized':
        strategyInstruction = `Strategy: ANIME & MANGA STYLIZED.
Optimize for anime key visuals and Niji models. Emphasize crisp cel-shading, dynamic linework, expressive character styling, atmospheric glow, particle effects, and Japanese anime aesthetic.`
        break
      case 'detailed':
      default:
        strategyInstruction = `Strategy: ULTRA-DETAILED VISUAL DNA.
Produce an exhaustive, master-level prompt analyzing every facet: subject geometry, exact art medium (e.g. gouache, vector, oil paint), lighting temperature and rim-lighting, linework weight, color grading, and textures.`
        break
    }

    // Target Generator formatting rules
    let generatorRules = ''
    if (targetGenerator === 'midjourney') {
      const arTag = aspectRatioOverride !== 'auto' ? ` --ar ${aspectRatioOverride}` : ' --ar 1:1'
      generatorRules = `Target Engine: Midjourney v6 / Niji 6.
End the final prompt string with appropriate Midjourney parameters like "${arTag} --style raw --v 6.1" or appropriate niji flag.`
    } else if (targetGenerator === 'flux') {
      generatorRules = `Target Engine: Black Forest Labs FLUX.1.
Use vivid, descriptive, natural conversational language without cryptic tag spam. FLUX responds best to rich scene descriptions.`
    } else {
      generatorRules = `Target Engine: Stable Diffusion XL / DALL-E 3.
Use clear, highly descriptive prompts structured by subject, setting, art style, lighting, and quality modifiers.`
    }

    const customFocusInstruction = customFocus.trim()
      ? `Special User Focus / Custom Request: "${customFocus.trim()}". Make sure this custom requirement is prominently highlighted in the prompt!`
      : ''

    const systemInstruction = `You are an elite AI Art Director, Computer Vision analyst, and Image Prompt Engineer.
Your task is to analyze the user's provided reference image in detail and reverse-engineer it into:
1. A master-quality prompt tailored for the chosen AI image generator and analysis strategy.
2. A structured breakdown of the image's attributes for the builder.

${strategyInstruction}

${generatorRules}

${customFocusInstruction}

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
    "aspectRatio": "${aspectRatioOverride !== 'auto' ? aspectRatioOverride : '1:1'}"
  }
}
${languageInstruction}
No commentary, no markdown code block fences.`

    const userInstruction = `Analyze this image thoroughly according to the requested strategy and target generator. Reverse-engineer its visual DNA into a high-impact image prompt and structured breakdown.`

    let rawResult = ''

    if (provider === 'chatgpt') {
      rawResult = await callOpenAIVision({ apiKey: resolvedApiKey, model, systemInstruction, userInstruction, imageBase64, temperature: temp })
    } else if (provider === 'claude') {
      rawResult = await callClaudeVision({ apiKey: resolvedApiKey, model, systemInstruction, userInstruction, imageBase64, temperature: temp })
    } else if (provider === 'gemini') {
      rawResult = await callGeminiVision({ apiKey: resolvedApiKey, model, systemInstruction, userInstruction, imageBase64, temperature: temp })
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
