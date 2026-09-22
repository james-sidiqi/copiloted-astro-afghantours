# Route inventory — WG1
**Branch:** `chore/completion-wg1-baseline`  
**Base:** `chore/ready-2026-09-21` @ `57feb46`  
**Generated:** 2026-09-22 AFT from `npm run build` dist + WG1 scaffolding.  
**No deploy.**

## Summary

- Pre-scaffold dist index routes: **247** (`index.html` under `dist/`).
- HTML files including `/404.html`: **248** (pre-scaffold).
- WG1 adds: `/transportation/`, `/privacy/`, `/terms/` (getting-around retained).
- Tours: **22** CSV rows → **22** `/tours/{slug}/` + **1** `/tours/` index = **23** tour routes.


## Live-known URL deltas vs this dist

| Live / historical | Repo dist (WG1) | Action |
|---|---|---|
| `/transportation/` | **Scaffolded** `/transportation/` (+ legacy `/getting-around/`) | Prefer transportation; 301 getting-around → transportation |
| `/destinations/{province}/` | `/provinces/{province}/` (34) | 301 (see redirect-map) |
| `/destinations/{hub}/` e.g. kabul-city | `/destinations/{hub}/` **200** | Keep; not the same as province URLs |
| `/hubs/faizabad-city/` | `/hubs/faizabad/` | 301 |
| `/food-culture/dishes|drinks|produce|dried-fruits/...` | Flat `/food-culture/{slug}/` | 301 where mapped; flag UNMAPPED |
| `/privacy/`, `/terms/` | **Scaffolded** draft stubs | Operator review before final copy |
| `/regions/wakhan-northeast/` | **Missing** (regions: central/north/west/south/east only) | Content + data needed |
| `/Sample.html` | Not in dist | 410 pending cpanel-final discovery |
| Seven scheduled + signature set | All present under `/tours/{slug}/` | See table below |
| Custom journeys | `/contact?audience=…` + `/tours?type=custom` | Audience labels open facts |

## Primary scheduled set

| Slug | In CSV | Dist path |
|---|---|---|
| `weekend-in-kabul` | yes | `/tours/weekend-in-kabul/` |
| `winter-circuit` | yes | `/tours/winter-circuit/` |
| `summer-circuit` | yes | `/tours/summer-circuit/` |
| `fall-eastern-afghanistan` | yes | `/tours/fall-eastern-afghanistan/` |
| `spring-afghanistan-tour` | yes | `/tours/spring-afghanistan-tour/` |
| `buzkashi-expedition` | yes | `/tours/buzkashi-expedition/` |
| `signature-afghan-tour` | yes | `/tours/signature-afghan-tour/` |
| `heart-of-the-silk-road` | yes | `/tours/heart-of-the-silk-road/` |

## All tour slugs (CSV)

| Slug | travel_style | is_active | price_from |
|---|---|---|---|
| `central-afghanistan-discovery` | Cultural / Scenic | 1 | 1250 |
| `afghanistan-discovery-tour-spring` | Cultural / Scenic | 1 | 1890 |
| `afghanistan-discovery-tour-fall` | Cultural / Scenic | 1 | 1950 |
| `bamyan-skiing-tour` | Cultural / Scenic | 1 | 1300 |
| `buzkashi-expedition` | Cultural / Scenic | 1 | (empty / on request) |
| `custom-expedition` | Custom | 1 | 3500 |
| `kabul-surroundings` | Cultural / Scenic | 1 | 990 |
| `photography-tour` | Custom | 1 | 2850 |
| `scientific-expeditions` | Custom | 1 | 4500 |
| `weekend-in-kabul` | Cultural / Scenic | 1 | (empty / on request) |
| `winter-circuit` | Cultural / Scenic | 1 | (empty / on request) |
| `summer-circuit` | Cultural / Scenic | 1 | (empty / on request) |
| `treasures-of-silk-road-afghanistan` | Cultural / Scenic | 1 | 2450 |
| `timurid-grandeur-herat-tour` | Cultural / Scenic | 1 | 1850 |
| `timurid-grandeur-herat-tour-add-minaret-e-jam` | Cultural / Scenic | 1 | 2250 |
| `trek-the-wakhan-corridor` | Custom | 1 | 4850 |
| `panjshir-valley-emeralds-history` | Cultural / Scenic | 1 | 750 |
| `kandahar-durrani-empire-tour` | Cultural / Scenic | 1 | 1250 |
| `fall-eastern-afghanistan` | Cultural / Scenic | 1 | (empty / on request) |
| `spring-afghanistan-tour` | Cultural / Scenic | 1 | (empty / on request) |
| `signature-afghan-tour` | Cultural / Scenic | 1 | (empty / on request) |
| `heart-of-the-silk-road` | Cultural / Scenic | 1 | (empty / on request) |

## Provinces (34) — `/provinces/{slug}/`

`bamyan`, `daykundi`, `ghazni`, `kabul`, `kapisa`, `logar`, `panjshir`, `parwan`, `wardak`, `khost`, `kunar`, `laghman`, `nangarhar`, `nuristan`, `paktia`, `paktika`, `badakhshan`, `baghlan`, `balkh`, `faryab`, `jowzjan`, `kunduz`, `samangan`, `sar-e-pol`, `takhar`, `helmand`, `kandahar`, `nimroz`, `uruzgan`, `zabul`, `badghis`, `farah`, `ghor`, `herat`

## Hubs (content MD) — `/hubs/{slug}/`

`bamyan-city`, `faizabad`, `ghazni-city`, `herat-city`, `jalalabad-city`, `kabul-city`, `kandahar-city`, `mazar-e-sharif`

Live alias: `faizabad-city` → `faizabad`.

## Regions — `/regions/{slug}/`

`central`, `north`, `west`, `south`, `east`

**Missing vs live:** `wakhan-northeast`.

## Destinations (hub-style) — `/destinations/{slug}/`

`bamyan-city`, `faizabad`, `farah-city`, `ghazni-city`, `herat-city`, `jalalabad-city`, `kabul-city`, `kandahar-city`, `khost-city`, `lashkar-gah`, `mazar-e-sharif`, `parun`, `yakawlang`, `zaranj`

Note: these are **not** province pages; live used `/destinations/{province}` for provinces.

## Food & culture (flat) — `/food-culture/{slug}/`

Count: **48** dish pages + index.

<details><summary>Slug list</summary>

`afghan-dried-fruits`, `afghan-green-tea`, `afghan-halwa`, `afghan-naan`, `ash-soup`, `aushak-dumplings`, `balkh-almonds`, `balkh-melon`, `bamyan-potatoes`, `bolani-flatbread`, `chapli-kebab`, `chicken-qabili`, `doogh-yogurt-drink`, `farah-watermelon`, `firni-pudding`, `ghazni-qabili-pulao`, `ghor-grapes`, `gosh-e-fil`, `herat-baklava`, `herat-ice-cream`, `herat-raisins`, `herat-saffron`, `herati-kebab`, `herati-pilaf`, `jalebi-sweet`, `jowzjan-gorgak`, `kabul-kebab`, `kabuli-pulao`, `kandahar-kebab`, `kandahar-milk-tea`, `kandahar-pomegranate`, `kandahar-rosht`, `kandahar-sweets`, `korma-e-herati`, `kulcha-cookie`, `kunduz-melon`, `lassi-drink`, `mantu-dumplings`, `panjshir-walnuts`, `qaroot-khurti`, `saffron-tea`, `samangan-pistachios`, `sambosa-pastry`, `sheer-e-yakh`, `sheer-pira`, `sheermal-bread`, `shorwa-soup`, `wardak-red-apples`

</details>

Nested live paths → flat: see `docs/redirect-map.csv` (mapped + UNMAPPED flags).

## Full dist route list (pre-scaffold)

Total: 247

```
/
/about/
/attractions/
/attractions/ai-khanoum/
/attractions/alingar-valley/
/attractions/ancient-city-of-balkh/
/attractions/ayno-mina-kandahar/
/attractions/baba-wali-shrine/
/attractions/baburs-gardens-bagh-e-babur/
/attractions/badakhshan-mountains-lakes/
/attractions/badghis-hills-nomadic-pastures/
/attractions/bala-hisar-of-ghazni/
/attractions/bala-hissar-kabul/
/attractions/band-e-amir-national-park/
/attractions/barg-e-matal-highland-lakes/
/attractions/bashgal-valley/
/attractions/buddha-niches-of-bamyan/
/attractions/chehel-burj-bamyan-ruins/
/attractions/chicken-street/
/attractions/chilzina-forty-steps/
/attractions/darulaman-palace/
/attractions/darunta-lake-reservoir/
/attractions/daykundi-highlands-hazarajat/
/attractions/dragon-valley-dara-e-ajdahar/
/attractions/farah-citadel-farah-river/
/attractions/faryab-cultural-villages/
/attractions/gandamak-last-stand/
/attractions/gardez-zurmat-highlands/
/attractions/ghazi-olympic-stadium/
/attractions/ghazni-minarets/
/attractions/hadda-archaeological-site/
/attractions/helmand-river-landscape/
/attractions/herat-citadel-qala-ye-ikhtiyaruddin/
/attractions/herat-friday-mosque-masjid-e-jami/
/attractions/herat-minarets-musalla-complex/
/attractions/herat-old-city-bazaars/
/attractions/jabal-saraj-palace/
/attractions/jalalabad-city/
/attractions/kabul-national-museum/
/attractions/kabul-zoo/
/attractions/kahfroshi-bird-market/
/attractions/kamal-khan-dam/
/attractions/kharqa-sharif-mosque/
/attractions/khost-city-tani-district-scenery/
/attractions/khurd-kabul-pass-1842/
/attractions/koh-e-baba-range/
/attractions/kunar-river-valley/
/attractions/kunduz-city-farmlands/
/attractions/logar-valleys/
/attractions/malan-bridge/
/attractions/massoud-mausoleum/
/attractions/minaret-e-jam-unesco/
/attractions/mt-noshaq/
/attractions/murad-khane-old-city/
/attractions/nijrab-valley/
/attractions/nimroz-citadel/
/attractions/noh-gombad-nine-domes/
/attractions/omar-landmine-museum/
/attractions/paktika-highlands-villages/
/attractions/parun-valley/
/attractions/paryan-valley-trek/
/attractions/qala-e-bost/
/attractions/qala-muhammad/
/attractions/qalai-jangi-fortress/
/attractions/qargha-lake/
/attractions/rumi-home-madrasa/
/attractions/rural-ghor-highlands-villages/
/attractions/sakhi-shrine-karte-sakhi/
/attractions/salang-pass-and-tunnel/
/attractions/samangan-buddha-caves/
/attractions/sar-e-pol-nomadic-meadows/
/attractions/shah-e-du-shamshira/
/attractions/shahjoy-qalat-valleys/
/attractions/shahr-e-gholghola/
/attractions/shahr-e-zohak/
/attractions/shrine-of-hazrat-ali-blue-mosque/
/attractions/shrine-of-mirwais-hotak/
/attractions/surkh-kotal/
/attractions/takht-e-rostam-samangan/
/attractions/tala-tepe/
/attractions/tapa-sardar-archaeological-site/
/attractions/tape-nader-khan/
/attractions/taq-e-zafar-paghman/
/attractions/tarin-kot-surroundings/
/attractions/the-wakhan-corridor/
/attractions/tomb-of-ahmad-shah-durrani/
/attractions/tomb-of-rabia-balkhi/
/attractions/tomb-of-sultan-mahmud-ghaznavi/
/attractions/tv-tower-hill-asmai/
/attractions/wardak-highlands-villages/
/attractions/wazir-akbar-khan-hill/
/contact/
/cultural-experiences/
/cultural-experiences/afghan-carpets/
/cultural-experiences/afghan-weddings/
/cultural-experiences/arg-restaurant-herat/
/cultural-experiences/buzkashi/
/cultural-experiences/chashma-e-dogh/
/cultural-experiences/eid-and-celebrations/
/cultural-experiences/glassblowers-of-herat/
/cultural-experiences/gudiparan-bazi/
/cultural-experiences/istalif-pottery/
/cultural-experiences/kaftar-bazi/
/cultural-experiences/kuchi-nomads/
/cultural-experiences/pahlawani/
/cultural-experiences/paktika-livestock-markets/
/destinations/
/destinations/bamyan-city/
/destinations/faizabad/
/destinations/farah-city/
/destinations/ghazni-city/
/destinations/herat-city/
/destinations/jalalabad-city/
/destinations/kabul-city/
/destinations/kandahar-city/
/destinations/khost-city/
/destinations/lashkar-gah/
/destinations/mazar-e-sharif/
/destinations/parun/
/destinations/yakawlang/
/destinations/zaranj/
/faq/
/food-culture/
/food-culture/afghan-dried-fruits/
/food-culture/afghan-green-tea/
/food-culture/afghan-halwa/
/food-culture/afghan-naan/
/food-culture/ash-soup/
/food-culture/aushak-dumplings/
/food-culture/balkh-almonds/
/food-culture/balkh-melon/
/food-culture/bamyan-potatoes/
/food-culture/bolani-flatbread/
/food-culture/chapli-kebab/
/food-culture/chicken-qabili/
/food-culture/doogh-yogurt-drink/
/food-culture/farah-watermelon/
/food-culture/firni-pudding/
/food-culture/ghazni-qabili-pulao/
/food-culture/ghor-grapes/
/food-culture/gosh-e-fil/
/food-culture/herat-baklava/
/food-culture/herat-ice-cream/
/food-culture/herat-raisins/
/food-culture/herat-saffron/
/food-culture/herati-kebab/
/food-culture/herati-pilaf/
/food-culture/jalebi-sweet/
/food-culture/jowzjan-gorgak/
/food-culture/kabul-kebab/
/food-culture/kabuli-pulao/
/food-culture/kandahar-kebab/
/food-culture/kandahar-milk-tea/
/food-culture/kandahar-pomegranate/
/food-culture/kandahar-rosht/
/food-culture/kandahar-sweets/
/food-culture/korma-e-herati/
/food-culture/kulcha-cookie/
/food-culture/kunduz-melon/
/food-culture/lassi-drink/
/food-culture/mantu-dumplings/
/food-culture/panjshir-walnuts/
/food-culture/qaroot-khurti/
/food-culture/saffron-tea/
/food-culture/samangan-pistachios/
/food-culture/sambosa-pastry/
/food-culture/sheer-e-yakh/
/food-culture/sheer-pira/
/food-culture/sheermal-bread/
/food-culture/shorwa-soup/
/food-culture/wardak-red-apples/
/getting-around/
/hotels/
/hubs/
/hubs/bamyan-city/
/hubs/faizabad/
/hubs/ghazni-city/
/hubs/herat-city/
/hubs/jalalabad-city/
/hubs/kabul-city/
/hubs/kandahar-city/
/hubs/mazar-e-sharif/
/provinces/badakhshan/
/provinces/badghis/
/provinces/baghlan/
/provinces/balkh/
/provinces/bamyan/
/provinces/daykundi/
/provinces/farah/
/provinces/faryab/
/provinces/ghazni/
/provinces/ghor/
/provinces/helmand/
/provinces/herat/
/provinces/jowzjan/
/provinces/kabul/
/provinces/kandahar/
/provinces/kapisa/
/provinces/khost/
/provinces/kunar/
/provinces/kunduz/
/provinces/laghman/
/provinces/logar/
/provinces/nangarhar/
/provinces/nimroz/
/provinces/nuristan/
/provinces/paktia/
/provinces/paktika/
/provinces/panjshir/
/provinces/parwan/
/provinces/samangan/
/provinces/sar-e-pol/
/provinces/takhar/
/provinces/uruzgan/
/provinces/wardak/
/provinces/zabul/
/regions/
/regions/central/
/regions/east/
/regions/north/
/regions/south/
/regions/west/
/safety/
/tours/
/tours/afghanistan-discovery-tour-fall/
/tours/afghanistan-discovery-tour-spring/
/tours/bamyan-skiing-tour/
/tours/buzkashi-expedition/
/tours/central-afghanistan-discovery/
/tours/custom-expedition/
/tours/fall-eastern-afghanistan/
/tours/heart-of-the-silk-road/
/tours/kabul-surroundings/
/tours/kandahar-durrani-empire-tour/
/tours/panjshir-valley-emeralds-history/
/tours/photography-tour/
/tours/scientific-expeditions/
/tours/signature-afghan-tour/
/tours/spring-afghanistan-tour/
/tours/summer-circuit/
/tours/timurid-grandeur-herat-tour-add-minaret-e-jam/
/tours/timurid-grandeur-herat-tour/
/tours/treasures-of-silk-road-afghanistan/
/tours/trek-the-wakhan-corridor/
/tours/weekend-in-kabul/
/tours/winter-circuit/
/visa-entry/
```

**Post-scaffold verified:** `/transportation/`, `/privacy/`, `/terms/` present; build **251** pages.
