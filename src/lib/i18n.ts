export type Lang = 'en' | 'ja'

export function getLangFromSearch(searchParams: URLSearchParams): Lang {
  const lang = searchParams.get('lang')
  return lang === 'ja' ? 'ja' : 'en'
}

export const t = (lang: Lang) => ({
  homeTitle: lang === 'ja' ? 'AIビデオマーケットプレイス' : 'AI Video Marketplace',
  newProduct: lang === 'ja' ? '商品を作成' : 'New Product',
  price: lang === 'ja' ? '価格（円）' : 'Price (JPY)',
  priceYenPlaceholder: lang === 'ja' ? '価格（円）' : 'Price (JPY)',
  title: lang === 'ja' ? 'タイトル' : 'Title',
  description: lang === 'ja' ? '説明' : 'Description',
  youtubeUrl: lang === 'ja' ? 'YouTube プレビューURL（販売する動画のサンプル）' : 'YouTube preview URL (sample of the video being sold)',
  dropboxPath: lang === 'ja' ? 'Dropbox ファイルパス（販売する動画の本体）' : 'Dropbox file path (the full original video being sold)',
  create: lang === 'ja' ? '作成' : 'Create',
  saving: lang === 'ja' ? '保存中...' : 'Saving...',
  buy: lang === 'ja' ? 'CCBillで購入' : 'Buy with CCBill',
  priceJPYWithUSD: (yen: number, usdRate: number) => {
    const usd = (yen * usdRate).toFixed(2)
    return lang === 'ja' ? `¥${yen} (≈ $${usd})` : `¥${yen} (≈ $${usd})`
  },
  langToggle: lang === 'ja' ? 'English' : '日本語',
  header: {
    brand: 'Ailith',
    new: lang === 'ja' ? '新規' : 'New',
    settings: lang === 'ja' ? '設定' : 'Settings',
    dashboard: lang === 'ja' ? 'ダッシュボード' : 'Dashboard',
    admin: lang === 'ja' ? '管理' : 'Admin',
    messages: lang === 'ja' ? 'メッセージ' : 'Messages',
    logout: lang === 'ja' ? 'ログアウト' : 'Logout',
    login: lang === 'ja' ? 'ログイン / 新規登録' : 'Login / Sign Up'
  }
})


