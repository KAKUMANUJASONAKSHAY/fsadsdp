import React, { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function nextCode(length = 6) {
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

export default function CaptchaBox({ onChange }) {
  const canvasRef = useRef(null)
  const [code, setCode] = useState(() => nextCode())

  useEffect(() => {
    onChange(code)
  }, [code, onChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#e8f4ef'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < 6; i += 1) {
      ctx.strokeStyle = `rgba(31,157,120,${0.2 + Math.random() * 0.35})`
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    for (let i = 0; i < code.length; i += 1) {
      ctx.save()
      ctx.translate(16 + i * 24, 28)
      ctx.rotate((Math.random() - 0.5) * 0.5)
      ctx.fillStyle = i % 2 === 0 ? '#146e56' : '#0f5f7b'
      ctx.font = '700 22px Segoe UI'
      ctx.fillText(code[i], 0, 0)
      ctx.restore()
    }
  }, [code])

  return (
    <div className="captchaWrap">
      <canvas ref={canvasRef} width={180} height={48} className="captchaCanvas" />
      <button type="button" className="btn" onClick={() => setCode(nextCode())}>
        Refresh
      </button>
    </div>
  )
}
