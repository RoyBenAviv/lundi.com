'use client'

const { NavigationChevronDown } = require('monday-ui-react-core/icons')

export default function Group({ group }: { group: Group }) {
  return <section className="Group">
    <header>
        <h3><NavigationChevronDown/> {group.name}</h3>
    </header>
    <section>

    </section>
  </section>
}
