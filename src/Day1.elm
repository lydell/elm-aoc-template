module Day1 exposing (..)

import Html exposing (Html)
import LineParser
import Set exposing (Set)


parse : String -> Result String (List Int)
parse =
    LineParser.parse (String.toInt >> Result.fromMaybe "String.toInt failed")


solution1 : String -> Result String Int
solution1 =
    parse >> Result.andThen (solve1 2020 >> Result.fromMaybe "No solution found")


solve1 : Int -> List Int -> Maybe Int
solve1 target list =
    solve1Helper target (Set.fromList list) list
        |> Maybe.map (\( a, b ) -> a * b)


solve1Helper : Int -> Set Int -> List Int -> Maybe ( Int, Int )
solve1Helper target set list =
    case list of
        [] ->
            Nothing

        first :: rest ->
            let
                needle =
                    target - first
            in
            if Set.member needle set then
                Just ( first, needle )

            else
                solve1Helper target set rest


solution2 : String -> Result String Int
solution2 =
    parse >> Result.andThen (solve2 2020 >> Result.fromMaybe "No solution found")


solve2 : Int -> List Int -> Maybe Int
solve2 target list =
    solve2Helper target list
        |> Maybe.map (\( a, b, c ) -> a * b * c)


solve2Helper : Int -> List Int -> Maybe ( Int, Int, Int )
solve2Helper target list =
    case list of
        [] ->
            Nothing

        first :: rest ->
            case solve1Helper (target - first) (Set.fromList rest) rest of
                Just ( a, b ) ->
                    Just ( a, b, target - a - b )

                Nothing ->
                    solve2Helper target rest


main : Html Never
main =
    Html.div []
        [ showResult (solution1 puzzleInput)
        , showResult (solution2 puzzleInput)
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
1348
1621
1500
1818
1266
1449
1880
1416
1862
1665
1588
1704
1922
1482
1679
1263
1137
1045
1405
1048
1619
1520
455
1142
1415
1554
1690
1886
1891
1701
1915
1521
1253
1580
1376
1564
1747
1814
1749
1485
1969
974
1566
1413
1451
1200
1558
1756
1910
1044
470
1620
1772
1066
1261
1776
988
1976
1834
1896
1646
1626
1300
1692
1204
2006
1265
1911
1361
1766
1750
2000
1824
1726
1672
651
1226
1954
1055
1999
1793
1640
1567
1040
1426
1717
1658
1864
1917
695
1071
1573
1897
1546
1727
1801
1259
1290
1481
1148
1332
1262
1536
1184
1821
1681
1671
1612
1678
1703
1604
1697
2003
1453
1493
1797
1180
1234
1775
1859
1388
1393
667
1767
1429
1990
1322
1684
1696
1565
1380
1745
1685
1189
1396
1593
1850
1722
1495
1844
1285
1483
1635
1072
1947
1109
1586
1730
1723
1246
1389
1135
1827
1531
1583
1743
1958
183
1323
1949
1799
1269
1379
1950
1592
1467
1052
1418
2009
1227
1254
1865
1609
1848
1653
1691
1633
1349
1104
1790
1755
1847
1598
1872
1478
1778
1952
1694
1238
1825
1508
1141
1464
1838
1292
1403
1365
1494
934
1235
"""
