import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface Coordinates {
  lat: number;
  lon: number;
}

interface RouteDistanceResponse {
    distance: number;
}

@Injectable()
export class OrsIntegration {

    private readonly apiKey = process.env.ORS_API_KEY;

    private readonly urlBase = 'https://api.openrouteservice.org/v2/directions/driving-car';

    async rescueRouteDistance(
        start: Coordinates, 
        end: Coordinates,
    ): Promise<RouteDistanceResponse> {

        try {
            const response = await axios.post(
                this.urlBase,
                {
                    coordinates: [
                        [start.lon, start.lat],
                        [end.lon, end.lat]
                    ],
                    format: 'geojson'
                },
                {
                    headers: {
                        'Authorization': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                },
            );

            const summary = response.data.routes[0].summary;

            return {
                distance: summary.distance,
            };

        } catch (error) {
            console.error('Erro ao consultar rota no ORS:', error);
            throw new Error('Erro ao calcular rota com ORS');
        }
    }
}
