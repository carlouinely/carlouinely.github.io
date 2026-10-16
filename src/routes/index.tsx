import { createFileRoute } from '@tanstack/react-router'
import { About } from '~src/components/About'
import { Contact } from '~src/components/Contact'
import { Experience } from '~src/components/Experience'
import { Hero } from '~src/components/Hero'
import { Work } from '~src/components/Work'
import { pageHead, jsonLd, personStructuredData } from '~src/meta'
import { site } from '~src/site'

export const Route = createFileRoute('/')({
  head: () => ({
    ...pageHead({ title: site.defaultTitle, description: site.description, path: '/' }),
    scripts: [jsonLd(personStructuredData())],
  }),
  component: Home,
})

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Experience />
      <Contact />
    </main>
  )
}
