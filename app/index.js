import SearchableDropdown from './components/SearchableDropdown'

import { fetchData } from './utils/fetchSuggestions'

//base styles
import 'normalize.css'
import './assets/index.scss'

//elements
const elNameShort = document.querySelector('#name_short')
const elNameFull = document.querySelector('#name_full')
const elType = document.querySelector('#type')
const elInnKpp = document.querySelector('#inn_kpp')
const elAddress = document.querySelector('#address')

let timeout = null

customElements.define('searchable-dropdown', SearchableDropdown)

const dropdown = document.querySelector('#dropdown')

dropdown.addEventListener('input', (e) => {
  if (timeout) {
    timeout = clearTimeout(timeout)
  }
  timeout = setTimeout(async () => {
    const value = e.target.inputValue
    if (!value) return
    try {
      const response = await fetchData(value)

      const suggestions = response.suggestions
      dropdown.setItems(suggestions)
    } catch (error) {
      if (error.name === 'AbortError') return
      alert(error.message)
    }
  }, 1000)
})

dropdown.addEventListener('select', (e) => {
  const { target } = e
  if (!target.value) return

  const item = target.value.data
  const { type, inn, kpp, name, opf, address } = item
  elType.innerHTML = `Организация (${type})`
  elNameShort.value = name.short_with_opf
  elNameFull.value = name.full_with_opf
  elInnKpp.value = `${inn} / ${kpp}`
  elAddress.value = address.unrestricted_value
})
