export const ticketParams = (destination, protocol, content, ticketAmount, ticketTicketer, entrypoint = 'default') => {
    return {
        ticketTy: {
            prim: 'pair',
            args: [
                {
                    prim: 'string'
                },
                {
                    prim: 'bytes'
                }
            ]
        },
        ticketContents: {
            prim: 'Pair',
            args: [
                {
                    string: protocol
                },
                {
                    bytes: content
                }
            ]
        },
        ticketTicketer,
        ticketAmount,
        destination,
        entrypoint,
    }
}
