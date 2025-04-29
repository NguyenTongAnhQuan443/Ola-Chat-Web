import React, { useState } from 'react'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from '@giphy/react-components'
import { createPortal } from 'react-dom'

const gf = new GiphyFetch('d6tZDwUZ937sDnzDSgTi6TMrxthKKGGE')

interface Props {
  onSelect: (url: string) => void
  onClose: () => void
}

const StickerPicker = ({ onSelect, onClose }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const fetchGifs = (offset: number) => {
    setLoading(true)
    const request = searchTerm.trim()
      ? gf.search(searchTerm, { offset, limit: 20, type: 'stickers' })
      : gf.trending({ offset, limit: 20, type: 'stickers' })

    return request.finally(() => setLoading(false))
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '400px',
          height: '460px',
          background: '#fff',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Search stickers...'
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && <div>Loading...</div>}
          <Grid
            width={380}
            columns={3}
            fetchGifs={fetchGifs}
            onGifClick={(gif, e) => {
              e.preventDefault()
              const stickerUrl = gif.images.original.url || gif.images.fixed_height.url
              console.log('Selected sticker URL:', stickerUrl)
              onSelect(stickerUrl)
              onClose()
            }}
            gutter={8}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default StickerPicker
