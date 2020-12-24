module Day24 exposing (..)

import Hexagons.Hex as Hex exposing (Direction, Hex)
import Html exposing (Html)
import LineParser
import Regex exposing (Regex)
import Set


regex : Regex
regex =
    Regex.fromString "e|se|sw|w|nw|ne|."
        |> Maybe.withDefault Regex.never


parse : String -> Result String (List (List Direction))
parse =
    LineParser.parse
        (Regex.find regex
            >> List.map .match
            >> LineParser.parseGeneral "Direction"
                identity
                (\direction ->
                    case direction of
                        "e" ->
                            Ok Hex.E

                        "se" ->
                            Ok Hex.SE

                        "sw" ->
                            Ok Hex.SW

                        "w" ->
                            Ok Hex.W

                        "nw" ->
                            Ok Hex.NW

                        "ne" ->
                            Ok Hex.NE

                        _ ->
                            Err ("Unknown direction: " ++ direction)
                )
        )


solution1 : String -> Result String Int
solution1 =
    parse >> Result.map solve1


solve1 : List (List Direction) -> Int
solve1 =
    List.foldl
        (\directions blacks ->
            let
                next =
                    List.foldl
                        (\direction hex ->
                            Hex.neighbor hex direction
                        )
                        (Hex.intFactory ( 0, 0 ))
                        directions
                        |> hexToTriple
            in
            if Set.member next blacks then
                Set.remove next blacks

            else
                Set.insert next blacks
        )
        Set.empty
        >> Set.size


hexToTriple : Hex -> ( Int, Int, Int )
hexToTriple hex =
    ( Hex.intQ hex
    , Hex.intR hex
    , Hex.intS hex
    )


main : Html Never
main =
    Html.div []
        [ showResult (solution1 puzzleInput)
        ]


showResult : Result String Int -> Html msg
showResult result =
    Html.output []
        [ Html.text
            (case result of
                Ok int ->
                    String.fromInt int

                Err error ->
                    error
            )
        ]


puzzleInput : String
puzzleInput =
    """
weseswseswesewseseseswewswseswnenwsese
nwswwwnwwwswswseswseswwsewswnewsw
wnwnwsewwnwenwnwnwwwnwnwnewnwswne
nwnwnwewnwnwswwnenwsenenwnwnwnwenwnwnw
swswewswewneseeseswseewwsewnwne
swwnenenenwswsweneswswswswneewwsewnw
neswewseswswseswswswswneswwswsenewsese
nwwnenenwwnwnewnwsenenwsenwse
eswwnwswswswwneswwwwewnwnwswsewse
sewseneeesesewseseswnesesewseseeese
nwweneseeswnesewsesenwsese
swswswneswswswswwsw
nwnwnwnwnwswnwwnwnwnenwewnwsenwnwese
enwwneneseseswewneeswsenwneswneseenw
enwswesenwnwseenwseseeeswnwnwneseswnwe
eswwwswneneesenwenenenwswswnese
wnwweseswnwneenenewswwnweswwsesw
nwneswneeeswewwneseneseswswwwsenenw
nwweweeeswnwswesweneenweneeew
swseswswwwseswwwwwwwwnwewwne
nwsewsenwnwwwnenw
neswswneeeeeeneenwwnwneewseswwse
seesesewseswenwsesewneeenenwswnesew
eeenweeesweeeee
swnwnwnwswsewnenewswwwweswwsewswe
seneenwnwwnwswwnwnwnwwnwnwewwnwnw
swswneenenwwewswnwwswnewwnwswwww
neswenenwnwnenenenesenwswswnweswwsewnenw
eeseeeenweeseesesenwe
nenwneneneewneesenesenenenene
eenesewseseewe
nwnwwwwwwswswwneweeewswwwww
wwnesenweseneneeeneswswswnesenwnwe
swseseswenwsesesenweeswsesesewswnwnwnw
newswnweswswseswnenenene
neneeneneeeneeeswneeneesewwnwsenw
neeneswwnwnenwwneenwneseswneenewe
nenwswseswneswswswneswswswswwsewsweseww
sesewseeseesesesenewsenwnwswewsenew
swswneeseswswwwwswwneswswnwswswswsenw
swswswseswswneswswseswseswsweww
swwneswneswwseseenwswswswswswsenwswswsw
seswseesenwewsesesw
sweneswnwenewneseneenenwnwneseswseenw
nwnenenwnwnewenenwsweswne
wwnewwwwwwewewnwwwwnesewse
nwnwsewnwnwweswnenwnw
swneeneneeneneneneeenenee
eneweseeesenwwweeeeeeweene
nenwnwswnwnwnwnwnwnwnwnwnwnenwnwsese
nwneneesweneeeneenenene
eneesweneneenenwneesenwneneeneswnw
seswnwswneswswnwswswseseseswsesenwseesese
swwenwenwnwnwnwnwswwnwneswwnwneeenw
wseeseneneswwwnewnenenenwswwswswwsw
eneenwnwnenwwnwnwnwnwnwswnwnwnwnwsew
nwnwswswnwnwnwnwweweenwwnwnwnew
swenwsenenwswwneenenenwswnenenenenwnenenw
swnenwwneseswswwswneswwnewswswesenw
nenenenenwnwnesenwswnwenenwnenwenwneswne
wenenweeswsweswnwseswneeneneswswnw
seesesesesweseneswswswwnwwswsenewswsw
newwwsenwnwswwwnweswnwnewnwwsenese
senwwnwnenwnenenwnenenwnweenwnewwnw
eneswwseenenwnenwswswseeneenesesew
eseeeswwenwenweswseneeenenenene
seeswnweeswneeeeneswneneneneeeew
sewswwswwswneswseswneswnenwwswswseww
seseenwseswsesenwnwnwwseseesesese
swswseneswneswswswswsweswswswwswswnwsw
neeseeseneneenweewe
swwsenenenenwneneneneneneneeneneneswne
enwnenwnwneewswseenenenwswswnwnwenwnwsw
neswenwneeeeeeee
neesenesewswnwswsesewswseswsese
nwnwnwnewsenwnwsenesenwneswnewnenwnenw
eneswsenenenewene
wsenwnwnenwnwswwnwnwenwnenwswsenewwnw
nenewswneswsenwenwnwnesenwnwneeswneene
swneseseneswnesenesewwswesewseseswse
eneeewnewwwswnewesenwseseweswsene
neesweneswswneeeswneneeeeneenenw
wsenwnwwnwnwnwnwwwwww
sewwsewswwwnwwnwenwwnewwnwnwe
neeneeneeswneeeneee
swseneseneseseswnenwswneswenenwseswww
seseswswswwsewswswnewsesweneswnwswesw
seswswsenwswneswswswnwwsewnwwwswwse
swsenwswnwwswswnwsenwneneenesenwnenee
swnwswsewswswnewswswswswseswswswseswe
neeeeneneneneneweeene
sesweneseswnwneswswnwwnwneewenesee
sewswsesenesewseseseneswseseswnesesesw
nwswwswwswswswswswwneswswwswe
enwnewnwswnenenwwseswnwswsenwnenwene
esesesenweseeseseseeenwseseseswsenw
neeneneneswseewneswnwnenwnwnesenenesee
swswwwswswswswesww
wwwswnwswswenesewenweewneenwene
eseeenewwwwnenenewwneneneseewsese
wswsesweswswswnewswnw
neeeeneenesweeeswswneeeenwsenw
sesesenewnwswsenwnwnwwnwnwwwwseswsese
seeesesweeeseeenwenwsweneseewee
wneweswswwneenwwwsenewsewwwsw
nenewneneneneneenenenesewnenenene
seswswnwnenwnwnenwnenenenewnesweeswse
swesesesewnwseesenwswnwe
swewswwesesewswwnwweneenwswsww
seeswewswnwseeseseseesenwnwnwenwseese
neneswswwwseneswwneswswswswwswsesesw
seenwweeswenesweneeeneeeenweene
swwesenwswwenenwneewwsesww
nwwnwneeenwswnwenwnewwwnwnwswnwnw
neswneneneneneeneeenwneneswnenewnesene
eseseenesenwswsesenwseseeseseeswnese
neseswswenwnewneneswnenwneseswsweswsww
swsenwseneswswnesweeswswswswswswswswsww
eseeewseeeseneseeeseeewneseww
nwnwswwnwnwnwnwnenwwww
wwwwwnwnwwwneseww
seeswseneseeeseseseswwneeeseesesenw
wnwewnwnwwwnesewwnwnw
eesewsenwsesenesee
sesesewesweneewnweneesesese
nwseewseneswseseseeseewsenenweswese
wneswwswnenwwswseeswwwnw
nesesesewneseswswwswswswswesenwnwnwsesw
nwnwnenwnwnwnewnwwswnwewnwnwswenwnw
swseeswwnwnwsenenenwswwswseseswswsesesesw
swseseseeneewsesesewneesewseseeese
sewwsesenwwewnenenwneneenewnwnwe
nwwenwwnwnenwnenwnwnwsene
nwenwnwewnwwesesenwswwnwnenwwwne
senwsewwnwwwwwseenwswwnwwneese
wwwswwnwswsewewewwnewewswsww
swneeeenenwnwneswese
neswwwwwnweseenwneenwswswseeswnw
eswnenwswneeeswseneswneenenwnenwee
nwnewneswswwneeseseseswseneeneeseesw
neeneeeeweneswenweseswee
eseswnwwswnwsweseseswseswswsesesweswsw
seenwenwseswsesewweseseseweswse
eenweseswewneswwnwwenwwwenwsw
swseseswwwswwnenewwswswnwnesesw
wwnwswwswsewneneewnwnwwswnwwwwse
nenenesenenwnwnenenw
nenwwneneseneneswneswnenenweneneswne
nwsenewwnwnwnewwwswswswseeswwwswsee
swnwnwnwswneseeenesweeewesweeeee
swseseenwswswswwnwswwswsweswse
nwswnenenwneswswnenenwswnwneswswnweneneene
swswenwsenesewswswnwwenwswnwneswswswsw
wwswswnwwneswswswneeswsw
nwsweswwwwswwswwnewswweswsewswne
seewseswswnwwswsenenesweeswswwswnwnenw
neenwswseeswswsweseeneneeneewsewe
weenwsesesenwnwseseswseseseswnesesee
seswswseswswswnewsesw
nwnwnwwnwnwnwnwnwenwnwnwnw
neswneswseneswneneneneneneneewneneenw
swwnwneswnwswswwswswswsesewneeswesee
nenwnewnesenwswnwnenwnenwe
esenwswsesenesewseswseseswseswsw
eseweeeeewneeeeeeewene
seswnwneswswwseswsewsweseswswswseswse
nwwnwewwnwwnwswnww
nwseseswseswswswswswsweswswsw
enesenesenewswsenwneswnenwnewnwnwnenwnw
seswswnwneswsweswswswswswnwswswweswswesw
wseswswwwwsenenesweseeseswse
nwnwnewwenwnwswseew
nwwnwsenwnwnwnenesenwnenwnwnenwnwnwnwse
wwnwsewnewwsewnwnenwsenwwwwnwww
wwwewwwwwwwwwwwswnwe
seseesweenwenwsenwswsenwseeeseseswese
swwenwnwnwnwnwnwwnwnwnww
nwnenwneneseneneneswenenenenwnwsenwnew
nenwsenwnenenesenenenenenenwnwnwneseww
nwwnwnenenesenenenesenenwnenenenesewe
neneewneswnwsewnenenwnene
nenwneewswnwnwneneewneneneenwnenenw
nwwwnwwnwnwseswnwwwsenwwneswnewewne
esweneenenwsewwswswswswwseswsewnwne
wseenwseswnesenwse
eeeswenwesenesenwewswne
neswseseseneswseswseseneswseseswsenesesese
wsewewwnewwnenwsenewwwwswswsw
wneeeswewsesenenwsewnwsewnewseese
swnweewnwwseeswnenwseswneswwnesese
sesenwewsesewswsweneneseeseeesene
wnwenwwwnwewsewwwwswsewwww
seneenenwnweeeeeeneeseenwnwswse
wsenewwwwwnwwwnwnwnww
nenwnwenwwwnenewwneenenwesenene
seeeswsweseesewenweeseseeneenee
sesewenwseeeeseewswnweeeseeenw
swenwnwswnwnwseeneswnwnene
swswswwswneesewswwwneeneeweswsw
swwnweeswnesenenweseseeesesewseese
sweseswwwswwneenwwwswe
wneneneeesenenenwneseeneneneeneswne
swwesesewneswwenwwswwwwwwwwnwsw
swenwswswswswswwwwnwnwnwswewswswee
senwswnwseeeneeswse
swswnwesweswswsweswswswwswnwnwne
neswneeneneneneneneeneene
eneseeseeswenweeweseseswseeenese
seswnwseseswswenesenenesewsewswswswse
wsesenwneseseseew
swwwswwewswwswsww
nwswswnwswswsweswsweswswewsenwswnene
eeeeeewnweeeweeseeswnwneseee
nwwwnwnwwsenwnenwswenwnwnwnwnwnenwnwe
seswsenwnwwseeseseneeswswswswswswnenw
swwneeeeenenweswe
wwwwnwwwnwswnenwsewwewww
swnenwnenwnwnewswnwnwenenw
seewswsesenwswneeee
nwwwewwwenwwwwweswwwnwnwnwse
wwnwwwswnwewwwswwswnwenewww
seswnenwneswnwsweenwnweenwwwweswnw
neswneseenesweenenenew
nenenwwneneneeeneneenenwswewesweene
swswswswswneswswswnwswseswswwneeswesw
seeweeeeseseeneeswnwewnwesee
swnwewswswnwswneswswswsesweneswswswsw
swnewneswnwswseswswswswsweswswswneswsw
swnwswneneneewnwwenwse
sewwwnewwswwwwwsw
swnwswnewnwsesewsewnenwnwsenwsenwenw
nwnwnwnwsenwsenwnwnwnwnenwnenwnwswneswnwnw
senesesesesesesewsenwswseseneseeseswwse
sesenenweneseseseseswwnewseewsenww
wneneswnenenenenenesenenenenenenesenwnw
swswneenwnwnwnwwnwnwnwnwnenwnwsenwsenwnw
wwnwwneswswwwswswswswswesew
wwnwseswnwnewwswwwewsewwsewene
wswseeswswswswswnwwneeswswswwwswswsw
wwnewesesewwseenwnwswnwnwnwnwnwse
neeneswewwswneswnenenenweenewnenwsee
swenwnwsesweenweeeneneneswewseese
sewwseweseseeseseneseesesenwnewse
nenenwnwneswneneneneseeneneneswnenene
newseeeneneeeeneeneenenw
neeneneswswnwnwneneneneseneesewnwnene
seseenwseseeswseneseswsenwseesesesee
swswswsesenwswnwswseswneswseswswswseseswnw
eneneneneenwesweweeeeswwenese
enenwweeneneneneswswnenenenenenenene
sewswswnwswswneseseneneswswseswseswswsw
sesesenwwnwnwwnwwwwenenwwnww
seseseswswswseenwseseswsweseenwnwsesw
wnwswseswsenwsesenwnwesesweseesenenese
sesesenwseseseswseseseneseesewseswnww
seswseeseswnwnwseewenwswseeseswseswse
seseswseneswneenwwseesenewswnwswwswse
wnwneneseswnenewnwnenwneneenenenewsenene
neneseseeeewwewsweeenwnwneswee
nwwwewwewww
newnwswwesesewnenwneswnewnwseneesew
nwwwwewewwswwnenwsenwnwnwnwwww
neseneswnenwweeneseewswseeneeew
newwsenwsesesesweseewseseseneseseew
neneneswewneneneneeeewnenesene
enenwswseeneseseeseweseee
wnenewwswewseeswswwnwwswwwwsw
seswnwnweenwsweenwneseeneeenenwneswe
newwwwswswneswwwswsww
wwwwsenwswwnwewneswwww
neswnenwnenenwnenwswnenenwswnenwnw
wsesenenwnenwnwnwnwneswwnenenwnwnwene
neswswwwwnewswswwswswwnwsenewnwswee
eswwsenenwneeeseseweeeswswenese
newseenenweesweeseesewsesenwseesw
neswswsenesweseswwwwswsweeswsenwswsw
swnwneswnenewenenenenenwenwneneenesw
esweswswnwswswsewnweeewwwseeswnw
nwnwwseweswnwswnwwewnesewwnenenwnw
senwnwsenwnwnwnwseswwnwnenwnwnwnwenenw
swnewswwwwwnewwwwnwneewwwsew
neneneeeseneneneesewswewneeenee
wswsenewneenesewnenwnenwsenwneswswnene
neewwnwnenwnenesesenenwnenwsenenwneswnee
seswnwneenesenwnenenwswnewneneneenee
nwnwwnenwswwwnenwnwnwneswnwswnwnwsenwnwne
swwwnewsenesenwsenewseeswnenesenwwsw
senwseseseneswseenwwwse
seseswseseseseseseswswseenwswsesenw
nenesenenwswwsewnwswnwneneeewnwene
swswswwswswswswswswwneswsw
sweneseesenwesewnewnwseeseswnwesese
nwnwswswswseswswsweswsw
eswswwswswwnwswwswwswswneswswnwsesw
newwwwwwwewwsenwnenwewsenenwsw
nweswweenwnwswnwenwwnwswnwnwnwnwnwnw
senwwswnenwseswswswnewneeswwwww
senwseswswnweneeswseswswwseswneswswswsw
weswwsewnweeewweneswnesewsene
neeswswnwnwnwswnwswneewnwnwnwnwswnenww
nwswwneewnesenesenenwnenenenwnwnwnwnenw
sweseeneseeneswenwneswswnwesee
nesewnwnwwnwnwnwnwnwnwnwnenwnwsenwnw
newneeenweeeeneneseene
wesesenwneenenwneswwneneenweswsene
eswnwswnwsenesweneswswsweswswsenwswsesw
swsesenwseswswseswswewsenwswsesene
weseeseeswswweseeneseseneeseenwne
wswswswswwsenwswnewneswneswswwsewwsw
eseswnwesenwnwwnwswnwsweneeeneesesew
wnwwswswwwnewswsenwswswsesweswnww
eeeneeneswewseeeneeweneesww
wnenwswwseewwswnewwnewwsenwnwsew
nenwswenenwsenenwsenwnwnwnenewnenenwswsw
neswnewweeeeeeeneneenenenenwsee
ewnweeeeswswseeeenweeeeenwe

"""
