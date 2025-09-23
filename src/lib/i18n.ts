export type Lang = 'en' | 'ja'

export function getLangFromSearch(searchParams: URLSearchParams): Lang {
  const lang = searchParams.get('lang')
  return lang === 'ja' ? 'ja' : 'en'
}

export const t = (lang: Lang) => ({
  homeTitle: lang === 'ja' ? 'AIビデオマーケットプレイス' : 'AI Video Marketplace',
  newProduct: lang === 'ja' ? '商品を作成' : 'New Product',
  price: lang === 'ja' ? '価格' : 'Price',
  priceCentsPlaceholder: lang === 'ja' ? '価格（セント）' : 'Price (cents)',
  currencyCode: lang === 'ja' ? '通貨コード（数値）' : 'Currency code (numeric)',
  title: lang === 'ja' ? 'タイトル' : 'Title',
  description: lang === 'ja' ? '説明' : 'Description',
  youtubeUrl: lang === 'ja' ? 'YouTube プレビューURL（販売する動画のサンプル）' : 'YouTube preview URL (sample of the video being sold)',
  dropboxPath: lang === 'ja' ? 'Dropbox ファイルパス（販売する動画の本体）' : 'Dropbox file path (the full original video being sold)',
  create: lang === 'ja' ? '作成' : 'Create',
  saving: lang === 'ja' ? '保存中...' : 'Saving...',
  buy: lang === 'ja' ? 'CCBillで購入' : 'Buy with CCBill',
  priceUSD: (cents: number) => (lang === 'ja' ? `価格: $${(cents/100).toFixed(2)} USD` : `Price: $${(cents/100).toFixed(2)} USD`),
  langToggle: lang === 'ja' ? 'English' : '日本語'
})


