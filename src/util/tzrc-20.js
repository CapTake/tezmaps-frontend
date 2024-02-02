import { packDataBytes, unpackDataBytes } from '@taquito/michel-codec'
import { Schema } from '@taquito/michelson-encoder'
import { mic2arr } from '@taquito/utils'
import { tzrc20CommandType } from "./tzrc-20-type"

const encode = (params) => {
    const schema = new Schema(tzrc20CommandType)
    return schema.Encode(params)
}

export const prepareOperation = ({ op, tick, max, amt, lim, nbf = 0, cd = 0, dec = 0, exp = 0 }) => {
    let encoded = null

    switch (op) {
        case 'deploy':
            encoded = encode({
                deploy: {
                    tick,
                    max: Number(max),
                    lim: Number(lim) > 0 ? lim : max,
                    nbf,
                    cd,
                    dec,
                    exp
                }
            })
            break
        case 'mint':
            encoded = encode({
                mint: { tick, amt }
            })
            break
        default:
            throw new Error(`Unknown operation: "${op}"`)
    }

    return packDataBytes(encoded)    
}

export const decodeBytes = (string) => {
    const unpacked = unpackDataBytes(string)
    return mic2arr(unpacked)
}

