maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates,
    zoom:12,
});
// Create image element
const el = document.createElement("img");

el.src = listing.image.url;
el.className = "listing-marker";

// Create marker
new maptilersdk.Marker({
    element: el
})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4>
         <p>Exact location will be provided after booking.</p>`
    )
)
.addTo(map);
// new maptilersdk.Marker({ color: "#ff385c" })
//     .setLngLat(listing.geometry.coordinates)
//     .setPopup(
//         new maptilersdk.Popup({offset:25}).setHTML(
//             `<h4>${listing.title}</h4><p>Exact location will be provided after booking.</p>`
//         )
//     )
    
//     .addTo(map);


   // create the popup
// const popup = new Popup({ offset: 25 }).setText(
//     'hello'
// );


