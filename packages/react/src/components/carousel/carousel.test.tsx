import type { FC } from "react"
import { page, render } from "#test/browser"
import { Carousel } from "./"

interface TestComponentProps extends Carousel.RootProps {}

const TestComponent: FC<TestComponentProps> = (props) => {
  return (
    <Carousel.Root data-testid="carousel" {...props}>
      <Carousel.List data-testid="carouselList">
        {Array.from({ length: 5 }).map((_, index) => (
          <Carousel.Item key={index} index={index}>
            Slide {index + 1}
          </Carousel.Item>
        ))}
      </Carousel.List>

      <Carousel.PrevTrigger />
      <Carousel.NextTrigger />

      <Carousel.Indicators />
    </Carousel.Root>
  )
}

describe("<Carousel />", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test("sets `displayName` correctly", () => {
    expect(Carousel.Root.displayName).toBe("CarouselRoot")
    expect(Carousel.List.displayName).toBe("CarouselList")
    expect(Carousel.Item.displayName).toBe("CarouselItem")
    expect(Carousel.PrevTrigger.displayName).toBe("CarouselPrevTrigger")
    expect(Carousel.NextTrigger.displayName).toBe("CarouselNextTrigger")
    expect(Carousel.Indicators.displayName).toBe("CarouselIndicators")
    expect(Carousel.Indicator.displayName).toBe("CarouselIndicator")
  })

  test("sets `className` correctly", async () => {
    await render(<TestComponent />)

    await expect
      .element(page.getByTestId("carousel"))
      .toHaveClass("ui-carousel__root")
    await expect
      .element(page.getByTestId("carouselList"))
      .toHaveClass("ui-carousel__list")
    await expect
      .element(page.getByRole("tabpanel", { name: "1 of 5" }))
      .toHaveClass("ui-carousel__item")
    await expect
      .element(page.getByRole("tablist"))
      .toHaveClass("ui-carousel__indicators")
    await expect
      .element(page.getByRole("tab", { name: "Go to 1 slide" }))
      .toHaveClass("ui-carousel__indicator")
    await expect
      .element(page.getByRole("button", { name: "Go to previous slide" }))
      .toHaveClass("ui-carousel__trigger--prev")
    await expect
      .element(page.getByRole("button", { name: "Go to next slide" }))
      .toHaveClass("ui-carousel__trigger--next")
  })

  test("renders HTML tag correctly", async () => {
    await render(<TestComponent />)

    expect(page.getByTestId("carousel").element().tagName).toBe("SECTION")
    expect(page.getByTestId("carouselList").element().tagName).toBe("DIV")
    expect(
      page.getByRole("tabpanel", { name: "1 of 5" }).element().tagName,
    ).toBe("DIV")
    expect(page.getByRole("tablist").element().tagName).toBe("DIV")
    expect(
      page.getByRole("tab", { name: "Go to 1 slide" }).element().tagName,
    ).toBe("BUTTON")
    expect(
      page.getByRole("button", { name: "Go to previous slide" }).element()
        .tagName,
    ).toBe("BUTTON")
    expect(
      page.getByRole("button", { name: "Go to next slide" }).element().tagName,
    ).toBe("BUTTON")
  })

  test("should render defaultSlide correctly", async () => {
    await render(<TestComponent defaultIndex={1} />)

    await expect
      .element(page.getByText("Slide 2"))
      .toHaveAttribute("data-selected")
  })

  test("should render correctly slide when using control button", async () => {
    const { user } = await render(<TestComponent />)
    vi.useFakeTimers()

    const goNextSlideButton = page.getByRole("button", {
      name: "Go to next slide",
    })
    await user.click(goNextSlideButton)
    vi.advanceTimersByTime(25)

    const secondSlide = page.getByText("Slide 2")
    await expect.element(secondSlide).toHaveAttribute("data-selected")

    const goPreviousSlideButton = page.getByRole("button", {
      name: "Go to previous slide",
    })
    await user.click(goPreviousSlideButton)
    vi.advanceTimersByTime(25)

    const firstSlide = page.getByText("Slide 1")
    await expect.element(firstSlide).toHaveAttribute("data-selected")
  })

  test("should switch to correctly slide when click on indicator", async () => {
    const { user } = await render(<TestComponent />)
    vi.useFakeTimers()

    const tab = page.getByRole("tab", { name: "Go to 2 slide" })
    await user.click(tab)
    vi.advanceTimersByTime(25)

    const secondSlide = page.getByText("Slide 2")
    await expect.element(secondSlide).toHaveAttribute("data-selected")
  })

  test("should disabled next and prev button when looping is disabled", async () => {
    const { user } = await render(<TestComponent loop={false} />)
    vi.useFakeTimers()

    const goPreviousSlideButton = page.getByRole("button", {
      name: "Go to previous slide",
    })
    await expect.element(goPreviousSlideButton).toBeDisabled()

    const goLastSlideTab = page.getByRole("tab", { name: "Go to 5 slide" })
    await user.click(goLastSlideTab)

    vi.advanceTimersByTime(25)

    const goNextSlideButton = page.getByRole("button", {
      name: "Go to next slide",
    })
    await expect.element(goNextSlideButton).toBeDisabled()
  })

  test("should move the carousel correctly when left or right arrow keys are pressed", async () => {
    const { user } = await render(<TestComponent orientation="horizontal" />)
    vi.useFakeTimers()

    await user.click(page.getByRole("tab", { name: "Go to 1 slide" }))
    vi.advanceTimersByTime(25)

    await user.keyboard("{ArrowDown}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowUp}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowRight}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 2"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowLeft}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowLeft}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 5"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowRight}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{End}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 5"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{Home}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")
  })

  test("should move the carousel correctly when up or down arrow keys are pressed", async () => {
    const { user } = await render(<TestComponent orientation="vertical" />)
    vi.useFakeTimers()

    await user.click(page.getByRole("tab", { name: "Go to 1 slide" }))
    vi.advanceTimersByTime(25)

    await user.keyboard("{ArrowLeft}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowRight}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowDown}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 2"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowUp}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowUp}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 5"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{ArrowDown}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{End}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 5"))
      .toHaveAttribute("data-selected")

    await user.keyboard("{Home}")
    vi.advanceTimersByTime(25)

    await expect
      .element(page.getByText("Slide 1"))
      .toHaveAttribute("data-selected")
  })

  test("renders custom children in CarouselIndicators", async () => {
    await render(
      <Carousel.Root>
        <Carousel.List>
          {Array.from({ length: 3 }).map((_, index) => (
            <Carousel.Item key={index} index={index}>
              Slide {index + 1}
            </Carousel.Item>
          ))}
        </Carousel.List>

        <Carousel.Indicators>
          <button>Custom</button>
        </Carousel.Indicators>
      </Carousel.Root>,
    )

    const customIndicator = page.getByRole("button", { name: "Custom" })
    await expect.element(customIndicator).toBeVisible()
  })

  test("renders CarouselIndicators with render prop returning a valid element", async () => {
    await render(
      <Carousel.Root>
        <Carousel.List>
          {Array.from({ length: 3 }).map((_, index) => (
            <Carousel.Item key={index} index={index}>
              Slide {index + 1}
            </Carousel.Item>
          ))}
        </Carousel.List>

        <Carousel.Indicators
          render={({ index, selected }) => (
            <button data-testid={`render-indicator-${index}`}>
              {selected ? "active" : "inactive"}
            </button>
          )}
        />
      </Carousel.Root>,
    )

    await expect.element(page.getByTestId("render-indicator-0")).toBeVisible()
    await expect.element(page.getByTestId("render-indicator-1")).toBeVisible()
    await expect.element(page.getByTestId("render-indicator-2")).toBeVisible()
  })

  test("renders CarouselIndicators with render prop returning a non-element", async () => {
    await render(
      <Carousel.Root>
        <Carousel.List>
          {Array.from({ length: 3 }).map((_, index) => (
            <Carousel.Item key={index} index={index}>
              Slide {index + 1}
            </Carousel.Item>
          ))}
        </Carousel.List>

        <Carousel.Indicators render={({ index }) => `dot-${index}`} />
      </Carousel.Root>,
    )

    await expect.element(page.getByText("dot-0")).toBeVisible()
    await expect.element(page.getByText("dot-1")).toBeVisible()
  })
})
