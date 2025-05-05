function fetchItem1Data() {
    return new Promise(resolve =>
        setTimeout(() => resolve('✅ Item 1 loaded from server'), 1000)
    )
}

const resource = wrapPromise(fetchItem1Data())

export default function Item1() {
    const data = resource.read()
    return <div>{data}</div>
}