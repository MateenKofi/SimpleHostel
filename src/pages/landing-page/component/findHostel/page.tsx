import { Header } from '../header'
import { FindHostel } from './find-hostel'

export default function FindHostelPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <FindHostel />
      </main>
    </div>
  )
}

