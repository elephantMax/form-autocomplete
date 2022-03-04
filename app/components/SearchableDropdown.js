const styleTemplate = `
      * {
        box-sizing: border-box;
      }
      :host {
        position: relative;
      }

      input {
        width: 100%;
      }

      ul {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin: 0;
        padding: 0;
        list-style-type: none;
        max-height: 150px;
        overflow-y: auto;
        background-color: #fff;
        box-shadow: 0px 0px 3px #00000085;
      }

      li {
        padding: 5px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      li:hover {
        background-color: #ececec;
      }

  `

export default class SearchableDropdown extends HTMLElement {
  value = null
  items = []
  listEl = null
  inputEl = null
  inputValue = ''

  constructor() {
    super()
  }

  showItems() {
    this.listEl.style.display = 'block'
  }

  hideItems() {
    this.listEl.style.display = 'none'
  }

  updateItemsVisablility() {
    if (!!this.inputValue && this.items.length > 0) {
      return this.showItems()
    }
    this.hideItems()
  }

  setItems(value) {
    this.items = value
    const list = this.createListElement()
    this.listEl.innerHTML = list.innerHTML
    this.updateItemsVisablility()
  }

  setInputValue(value) {
    this.inputValue = value
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    const { input, style, list } = this.createElements()

    this.inputEl = input
    this.listEl = list

    this.shadowRoot.appendChild(input)
    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(list)
  }

  static get observedAttributes() {
    return ['value']
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === 'value') {
      this.setInputValue(newValue)
    }
  }

  craeteInputElement() {
    const input = document.createElement('input')
    const placeholder = this.getAttribute('placeholder') || ''
    input.setAttribute('placeholder', placeholder)
    input.addEventListener('input', (e) => {
      const {
        target: { value },
      } = e

      this.setAttribute('value', value)
      this.updateItemsVisablility()
    })

    input.addEventListener('focus', this.showItems.bind(this))
    input.addEventListener('blur', this.hideItems.bind(this))

    return input
  }

  createListElement() {
    const list = document.createElement('ul')
    this.items.forEach((item) => {
      const li = document.createElement('li')
      const nameSpan = document.createElement('span')
      const addressSpan = document.createElement('span')
      nameSpan.textContent = item.data.name.short_with_opf
      addressSpan.textContent = `${item.data.inn} ${item.data.address.value}`
      li.appendChild(nameSpan)
      li.appendChild(addressSpan)
      li.dataset.value = item.data.hid
      list.appendChild(li)
    })
    list.addEventListener('mousedown', (e) => {
      const { target } = e
      const li = target.closest('li')

      if (!li) return

      const id = li.dataset.value

      this.value = this.items.find((item) => item.data.hid === id)
      if (!this.value) return
      const { name } = this.value.data
      this.dispatchEvent(new Event('select'))

      this.setAttribute('value', name.short_with_opf)
      this.inputEl.value = name.short_with_opf
    })

    return list
  }

  createElements() {
    const input = this.craeteInputElement()

    const style = document.createElement('style')
    style.innerHTML = styleTemplate

    const list = this.createListElement()

    return {
      style,
      input,
      list,
    }
  }
}
