import PocketBase from 'pocketbase';

export const api = new PocketBase(import.meta.env.VITE_BACKEND_API)
export const DEPRECATED = ['tezmaps']
export const TRUSTED = ['tezmap', 'tzrc-20:tezi', 'tzrc-20b:test', 'tzrc-20b:2027' ]
export const TRUSTED_DETAILS =
    [
        { name: 'tezmap', description: 'Tezmap Protocol ' },
        { name: 'tzrc-20:tezi', description: 'First Tezos inscriptions tzrc-20 token experiment' } , 
        { name: 'tzrc-20b:test', description: 'Test tzrc-20b token. Intention of beeing used for testing.' },
        { name: 'tzrc-20b:2027', description: 'Official tzrc-20b token of the 2027 coin' },
    ]




