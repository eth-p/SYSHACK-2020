# Hackamon: Hackamon Database
This module contains all the Hackamon configuration data and assets.

## Hackamon Config
To create a hackamon, you create a subdirectory for the hackamon.
If you want to create a hackamon with the ID "examplchu", you create an `examplchu` directory.

```bash
mkdir examplchu
```

Inside this directory, you add the Hackamon configuration file `examplchu.yml`:

```yaml
name: Examplchu                      # The human-readable name of the Hackamon.
type: [FIRE]                         # The element type of the Hackamon.

stats:
  health:            150             # The base health value at max level.
  physical_attack:   100             # The physical attack value at max level.
  phsyical_defence:  80              # The physical defence value at max level.
  special_attack:    20              # The special attack value at max level.
  special_defence:   50              # The special defence value at max level.
  speed:             60              # The speed value at max level.

assets:                           
  regular:
    sprite: examplechu.png           # The sprite for the non-shiny version of the Hackamon.
    image:  examplechu.png           # The image for the non-shiny version of the Hackamon.
  shiny:
    sprite: examplechu-shiny.png     # The sprite for the shiny version of the Hackamon.
    image:  examplechu-shiny.png     # The image for the shiny version of the Hackamon.
```

If you don't have a sprite designed for the Hackamon, you can use the regular image asset.
