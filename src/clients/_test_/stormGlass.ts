import axios, { AxiosError, AxiosStatic } from "axios";
import config, { IConfig } from "config";
import { InternalError } from '../../util/error/interneal-error';

export interface StormGlassPointSource {
    [key: string]: number
}
export interface StormGlassPoint {
    readonly time: string
    readonly swellDirection: StormGlassPointSource
    readonly waveHeight: StormGlassPointSource
    readonly waveDirection: StormGlassPointSource
    readonly swellHeight: StormGlassPointSource
    readonly swellPeriod: StormGlassPointSource
    readonly windDirection: StormGlassPointSource
    readonly windSpeed: StormGlassPointSource
}
export interface StormGlassForecastResponse {
    hours: StormGlassPoint[]
}
export interface ForecastPoint {
    time: string
    waveHeight: number
    waveDirection: number
    swellHeight: number
    swellPeriod: number
    windDirection: number
    windSpeed: number
    swellDirection: number
}
export class ClientRequestError extends InternalError{
    constructor(message: string){
        const internalMessage = 'Unexpected error when trying to comunicate to StormGlass: ';
        super(`${internalMessage}: ${message}`)
    }
}
export class StormGlassResponseError extends InternalError{
    constructor(message: string){
        const internalMessage = 'Unexpected error when trying to comunicate to StormGlass: ';
        super(`${internalMessage}: ${message}`)
    }
}
const stormGlassrResourceConfig: IConfig = config.get(
    'App.resources.StormGlass'
)
export class StormGlass {
    readonly stormGlassAPIParams = 'swellDorection,swellHeight,swellPeriod,waveDorectopm,waveHeight,windDirection,windSpeed'
    readonly stormGlassAPISource = 'noaa'

    constructor(protected request: AxiosStatic = axios) { }

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
        try {
            const response = await this.request.get<StormGlassForecastResponse>(
                `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`,
                {
                  headers: {
                    Authorization: 'fake-token',
                  },
                }
              );
              return this.normalizeResponse(response.data);
        } catch (err: unknown) {
            const error = err as AxiosError
            const errorType = err as Error
            if(error.response && error.response?.data){
                throw new StormGlassResponseError(`Error ${JSON.stringify(error.response.data)} Code: ${error.response.status}`)
            }
            throw new ClientRequestError(errorType.message)
        }
    }

    private normalizeResponse(
        points: StormGlassForecastResponse
    ): ForecastPoint[] {
        return points?.hours?.filter(this.isValidPoint.bind(this)).map((point) => ({
            swellDirection: point.swellDirection[this.stormGlassAPISource],
            swellHeight: point.swellHeight[this.stormGlassAPISource],
            swellPeriod: point.swellPeriod[this.stormGlassAPISource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassAPISource],
            waveHeight: point.waveHeight[this.stormGlassAPISource],
            windDirection: point.windDirection[this.stormGlassAPISource],
            windSpeed: point.windSpeed[this.stormGlassAPISource],
        }));
    }

    private isValidPoint(point: Partial<StormGlassPoint>): boolean {
        return !!(
            point.time &&
            point.swellDirection?.[this.stormGlassAPISource] &&
            point.swellHeight?.[this.stormGlassAPISource] &&
            point.swellPeriod?.[this.stormGlassAPISource] &&
            point.waveDirection?.[this.stormGlassAPISource] &&
            point.waveHeight?.[this.stormGlassAPISource] &&
            point.windDirection?.[this.stormGlassAPISource] &&
            point.windSpeed?.[this.stormGlassAPISource]
        );
    }
}