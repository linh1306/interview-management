# In ra tất cả các elements có class chứa 'select' va debug
elements = self.page.query_selector_all("div[class*='select']")
for element in elements:
    print(f"Found element with class: {element.get_attribute('class')}")
    try:
        self.page.click(f"div[class='{element.get_attribute('class')}']", timeout=1000)
        print(f"Successfully clicked element")
    except Exception as e:
        print(f"Could not click element. Error: {e}")

        # ant-select-dropdown css-dev-only-do-not-override-98ntnt ant-select-dropdown-placement-bottomLeft
        # ant-select-item ant-select-item-option ant-select-item-option-active ant-select-item-option-selected
