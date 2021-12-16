import {StormGlass} from './stormGlass'
import axios from 'axios'
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3hours.json'

jest.mock('axios')
describe('StormGlass client',()=>{
    it('should return the normalized forecast from the StormGlass service', async()=>{
        const lat =-33.792726
        const lng = 151.289824

        axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursFixture)

        const stormGlass = new StormGlass(axios)
        const response = await stormGlass.fetchPoints(lat,lng)
        expect(response).toEqual({})
    })
})