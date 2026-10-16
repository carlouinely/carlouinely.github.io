import { createFileRoute } from '@tanstack/react-router'
import { About } from '~src/components/About'
import { Contact } from '~src/components/Contact'
import { Experience } from '~src/components/Experience'
import { Hero } from '~src/components/Hero'
import { Work } from '~src/components/Work'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Contact />
    </main>
  )
}
