import got from "got"

export interface TKResponse {
  ok: boolean
  status: string
  message?: string
}

export interface RadialSearchResponse extends TKResponse {
  license: string
  data: string
  stations: Station[]
}

export interface Station {
  id: string
  name: string
  brand: string
  street: string
  place: string
  lat: number
  lng: number
  dist: number
  diesel: number
  e5: number
  e10: number
  isOpen: boolean
  houseNumber: string
  postCode: number
}

export type SortableBy = "price" | "dist"
export type FuelTypes = "e5" | "e10" | "diesel"

export interface RadialSearchBase {
  lat: number
  lng: number
  rad?: number
  sort?: SortableBy
  type?: FuelTypes | "all"
}

export interface RadialSearchType extends RadialSearchBase {
  sort?: "price"
  type?: FuelTypes
}

export interface RadialSearchAll extends RadialSearchBase {
  type: "all"
  sort?: "dist"
}

export type RadialSearchArgs = RadialSearchType | RadialSearchAll

interface RadialSearchParams extends Required<RadialSearchBase> {
  [key: string]: any
  apikey: string
}

class Tankerkoenig {
  private baseURL = "https://creativecommons.tankerkoenig.de/json"
  private apikey: string

  constructor(apikey: string) {
    this.apikey = apikey
  }

  private throwIfNotOk = <R extends TKResponse>(response: R): R => {
    if (!response.ok) throw new Error(`tankerkoenig error: ${response.message}`)
    return response
  }

  radialSearch = async ({
    lat,
    lng,
    rad = 25,
    sort = "dist",
    type = "all",
  }: RadialSearchArgs): Promise<RadialSearchResponse> => {
    const searchParams: RadialSearchParams = { lat, lng, rad, type, sort, apikey: this.apikey }

    const data = (await got(this.baseURL + "/list.php", {
      searchParams,
    }).json()) as RadialSearchResponse

    return this.throwIfNotOk(data)
  }
}

export default Tankerkoenig
