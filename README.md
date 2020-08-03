# Fareto

(pronounced Fare-eh-to, rhymes with Pareto).

Display Pareto surfaces of travel time and fare from [r5](https://github.com/conveyal/r5). You need to be running the point-to-point server in R5Main (`R5Main --point`) and currently you need to use the `nyc-fares` branch of R5. An example output is below.

![Example Pareto Surface](fareto.png)
Example Pareto Surface, for travel from Salem, MA to Copley Square, Boston, MA

For details of the algorithm, see [Conway and Stewart (2019)](https://files.indicatrix.org/Conway-Stewart-2019-Charlie-Fare-Constraints.pdf).

To run, type `yarn start`.

You can download the results using the "Download result JSON" link. A static version of Fareto can be deployed by putting results in the "results" folder of a public deploy.

If you set the environment variable `REACT_APP_MAPBOX_TOKEN` to a [Mapbox](https://mapbox.com) token, Mapbox Streets basemaps will be used instead of stock OpenStreetMap tiles. These are more performant and higher resolution.