import { createFileRoute } from '@tanstack/react-router'
import { About } from '~src/components/About'
import { Contact } from '~src/components/Contact'
import { Experience } from '~src/components/Experience'
import { Hero } from '~src/components/Hero'
import { Work } from '~src/components/Work'
import { pageHead } from '~src/meta'
import { site } from '~src/site'

export const Route = createFileRoute('/')({
  head: () => pageHead({ title: site.defaultTitle, description: site.description, path: '/' }),
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
