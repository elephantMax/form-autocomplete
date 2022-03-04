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
        background-color: #ccc;
        max-height: 150px;
        overflow-y: auto;
      }

      li {
        padding: 5px;
        cursor: pointer;
      }

      li:hover {
        background-color: #fff;
      }

  `

export default class SearchableDropdown extends HTMLElement {
  value = null
  items = []
  listEl = null
  isItemsVisible = false
  inputValue = ''

  constructor() {
    super()
  }

  showItems() {
    this.isItemsVisible = true
    this.listEl.style.display = 'block'
  }

  hideItems() {
    this.isItemsVisible = false
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

    this.listEl = list

    this.shadowRoot.appendChild(input)
    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(list)
  }

  static get observedAttributes() {
    return ['value']
  }

  attributeChangedCallback(name, oldValue, newValue) {
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

    return input
  }

  createListElement() {
    const list = document.createElement('ul')
    this.items.forEach((item) => {
      const li = document.createElement('li')
      li.textContent = item.data.name.full
      li.dataset.value = item.data.hid
      list.appendChild(li)
    })
    list.addEventListener('click', (e) => {
      const { target } = e
      if (target.tagName !== 'LI') {
        return
      }

      const id = target.dataset.value
      this.value = this.items.find((item) => item.data.hid === id)
      this.hideItems()
      this.dispatchEvent(new Event('select'))
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
