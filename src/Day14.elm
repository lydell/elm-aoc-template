module Day14 exposing (..)

import Binary
import Dict exposing (Dict)
import Html exposing (Html)
import LineParser


type Instruction
    = Mask (List MaskBit)
    | Mem Int Int


type MaskBit
    = Zero
    | One
    | X


parse : String -> Result String (List Instruction)
parse =
    LineParser.parse
        (\line ->
            case String.split " = " line of
                [ left, right ] ->
                    if left == "mask" then
                        String.toList right
                            |> LineParser.parseGeneral "MaskBit"
                                String.fromChar
                                (\char ->
                                    case char of
                                        '0' ->
                                            Ok Zero

                                        '1' ->
                                            Ok One

                                        'X' ->
                                            Ok X

                                        _ ->
                                            Err "Unknown MaskBit."
                                )
                            |> Result.map Mask

                    else if (left |> String.startsWith "mem[") && (left |> String.endsWith "]") then
                        Result.map2 Mem
                            (left
                                |> String.dropLeft 4
                                |> String.dropRight 1
                                |> String.toInt
                                |> Result.fromMaybe "Address is not a number."
                            )
                            (right
                                |> String.toInt
                                |> Result.fromMaybe "Value is not a number."
                            )

                    else
                        Err "Expected `mask` or `mem[digits]`"

                _ ->
                    Err "Expected `left = right`."
        )


solution1 : String -> Result String Int
solution1 =
    parse
        >> Result.andThen
            (solve
                (\mask address value ->
                    Dict.insert address (applyMask1 mask value)
                )
            )


applyMask1 : List MaskBit -> Int -> Int
applyMask1 mask value =
    List.map2
        (\maskBit bit ->
            case maskBit of
                Zero ->
                    False

                One ->
                    True

                X ->
                    bit
        )
        mask
        (value
            |> Binary.fromDecimal
            |> Binary.ensureSize (List.length mask)
            |> Binary.toBooleans
        )
        |> Binary.fromBooleans
        |> Binary.toDecimal


solve :
    (List MaskBit -> Int -> Int -> Dict Int Int -> Dict Int Int)
    -> List Instruction
    -> Result String Int
solve updateMemory instructions =
    case instructions of
        [] ->
            Err "Empty list of instructions."

        (Mask firstMask) :: rest ->
            rest
                |> List.foldl
                    (\instruction ( mask, memory ) ->
                        case instruction of
                            Mask nextMask ->
                                ( nextMask, memory )

                            Mem address value ->
                                ( mask, updateMemory mask address value memory )
                    )
                    ( firstMask, Dict.empty )
                |> Tuple.second
                |> Dict.values
                |> List.sum
                |> Ok

        _ ->
            Err "First instruction must be `mask =`."


solution2 : String -> Result String Int
solution2 =
    parse
        >> Result.andThen
            (solve
                (\mask address value memory ->
                    applyMask2 mask address
                        |> List.foldl
                            (\nextAddress ->
                                Dict.insert nextAddress value
                            )
                            memory
                )
            )


applyMask2 : List MaskBit -> Int -> List Int
applyMask2 mask address =
    let
        numX =
            mask
                |> List.filter ((==) X)
                |> List.length

        addressBits =
            address
                |> Binary.fromDecimal
                |> Binary.ensureSize (List.length mask)
                |> Binary.toBooleans
    in
    List.range 0 (2 ^ numX)
        |> List.map
            (\index ->
                let
                    floatingBits =
                        index
                            |> Binary.fromDecimal
                            |> Binary.ensureSize numX
                            |> Binary.toBooleans
                in
                List.map2 Tuple.pair
                    mask
                    addressBits
                    |> List.foldl
                        (\( maskBit, addressBit ) ( remainingFloatingBits, result ) ->
                            case maskBit of
                                Zero ->
                                    ( remainingFloatingBits, addressBit :: result )

                                One ->
                                    ( remainingFloatingBits, True :: result )

                                X ->
                                    case remainingFloatingBits of
                                        [] ->
                                            ( [], False :: result )

                                        first :: rest ->
                                            ( rest, first :: result )
                        )
                        ( floatingBits, [] )
                    |> Tuple.second
                    |> List.reverse
                    |> Binary.fromBooleans
                    |> Binary.toDecimal
            )


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
mask = 101XX10X1X00001010011011X1XXX1001011
mem[12898] = 4515455
mem[39269] = 262864
mem[15998] = 27
mem[4565] = 896581
mem[35263] = 872262
mask = 110X1111000X000111001XX0110X010111XX
mem[5436] = 29453
mem[405] = 4591187
mem[36544] = 119659504
mem[4590] = 1754617
mask = 11001111000100XX11000000000XX0X0X001
mem[18971] = 65392
mem[12898] = 60445914
mem[51566] = 8117
mem[7267] = 99056
mem[25605] = 978
mem[33329] = 437436
mask = 10X0X100X00000101X0X0001111111X101XX
mem[43594] = 7609
mem[12898] = 126982257
mem[15065] = 4039
mask = 11XX11XX000100X10110111001101000X110
mem[2358] = 139154
mem[48424] = 361
mask = X00X0X000101010111111000X11001000111
mem[60868] = 1012242539
mem[13504] = 114153
mem[51015] = 34551413
mem[43984] = 708156
mem[58774] = 436301
mem[15489] = 243282402
mem[10963] = 81839
mask = 1001000X1100001001001101XX01000001X0
mem[63618] = 3428738
mem[16270] = 289636637
mem[45847] = 271443
mem[38518] = 2789
mask = X0010X000101X00111110010101010X001X1
mem[56985] = 14253068
mem[10578] = 869930
mask = 10000100010100010X11X01X00X011010001
mem[31893] = 32746
mem[57677] = 1423
mem[43667] = 94853349
mem[7624] = 76941001
mem[20508] = 1273351
mask = 10XX00100011X0X0110XX1X10011XX111000
mem[28963] = 125041
mem[42777] = 251362
mem[34873] = 155374451
mem[29355] = 886081
mem[16775] = 57795906
mem[42311] = 10111
mem[30652] = 4443965
mask = 10000111XX000001X1X0X001011110X00111
mem[31369] = 31024146
mem[23234] = 1046769566
mask = 00XX1010XX1X001011010111X11X1010011X
mem[20251] = 3138
mem[23672] = 28276
mem[48425] = 304
mem[51384] = 6985
mask = 110X011X00000001X100111001X010010X0X
mem[44366] = 985
mem[47430] = 127814906
mem[34576] = 41033794
mem[58183] = 11571792
mask = XX0001X0010100011X11101010000101X011
mem[47311] = 897443
mem[47179] = 457654457
mask = X100X11100010X0XX10X1000X11001001100
mem[57561] = 38620862
mem[63945] = 78
mem[37164] = 2722
mask = 0000XXXX0011XX0XX1110010X10000111000
mem[52440] = 14680631
mem[10040] = 482410861
mem[31369] = 1312217
mask = 10X1X0001000X01111X01011100111111001
mem[33657] = 127832235
mem[59700] = 232182856
mem[64183] = 32458630
mem[13528] = 56706903
mask = 00XX110X0X0XX00111010101X001110111X0
mem[34491] = 23031313
mem[16152] = 2473
mem[46572] = 58257
mask = 11X1011X00000001010XXX1010X10000X000
mem[36932] = 54890
mem[17249] = 518900642
mem[58586] = 27068931
mask = 1100011X0000X00111001000X00011X11001
mem[4203] = 11690902
mem[20122] = 399199895
mem[32417] = 379534
mem[50520] = 3253466
mem[23645] = 12184122
mask = 100000X00001010011X01011100X0010X010
mem[59410] = 3462
mem[51849] = 231731736
mem[31141] = 17505
mem[2661] = 20669501
mem[57030] = 225241
mem[37965] = 4947
mem[37475] = 120
mask = 10XX01110001000XX10001X0101111000011
mem[54239] = 21386681
mem[25423] = 49927683
mem[17991] = 24735
mem[26742] = 66457157
mask = 10000100100X00100X011X11100X10100100
mem[42442] = 2898
mem[33841] = 98213928
mem[1295] = 436390
mem[20533] = 26130
mask = 00X0001X000X000011001X1010000X101101
mem[12898] = 85396
mem[17781] = 96765096
mem[23645] = 156257533
mem[41542] = 25550
mem[23694] = 19768
mask = 00000000X0111101X11101110110X01X0001
mem[30165] = 9659654
mem[17417] = 840
mem[38700] = 20540407
mem[17514] = 266223622
mask = 1X0X0X100001000011001000101X11X0XX11
mem[1187] = 2633
mem[49568] = 13636
mem[41073] = 2493
mem[42442] = 562308
mask = 10000XXX0001000X1100010X111111000001
mem[18887] = 22856
mem[7241] = 580581
mem[20501] = 15343308
mem[8329] = 9182
mem[30265] = 1720165
mem[55589] = 56956
mem[56070] = 99398329
mask = 11X0111100010001X1X0101X0011X01XX1XX
mem[22677] = 289814
mem[57909] = 24289535
mem[2053] = 96654349
mem[12868] = 30681
mem[28491] = 26428
mem[52407] = 644
mem[26000] = 1537
mask = 100001X11100X00X0110010X111X100X0110
mem[61720] = 4504409
mem[18231] = 20747971
mem[7557] = 40802
mem[8177] = 1825
mem[16963] = 831395
mem[58488] = 32600
mask = 10000X001000001XX1XX101111X11X100XX1
mem[23493] = 1676
mem[14482] = 39198509
mem[12119] = 277
mem[34873] = 839193094
mem[59700] = 213967901
mem[44792] = 4486
mask = 11101111XX0X00010X100X101XX100000X00
mem[21304] = 749
mem[17415] = 1039713731
mem[56228] = 1653
mask = 0000X0X000X1X000X1XXX01000100010100X
mem[54745] = 258440
mem[9496] = 1382
mem[677] = 160442786
mem[18231] = 118264
mem[3314] = 7774920
mem[48978] = 58150
mask = 11010X11000000X1110011100X001001X0X0
mem[11295] = 1701
mem[43085] = 35120466
mem[36184] = 717214
mem[11085] = 797499853
mem[50040] = 100884
mem[12868] = 76327
mem[1094] = 17127824
mask = X1X0111100000001X100100111101111X000
mem[23009] = 56150703
mem[62945] = 187456
mem[16270] = 2148
mem[6558] = 226
mem[18104] = 116620
mask = 1100111X000100010X0X1XX0111101X00X1X
mem[20277] = 41195
mem[55507] = 497048
mem[65060] = 1392113
mem[39631] = 729
mem[20012] = 221
mem[38700] = 157
mask = 1011110X1100001010XX01X111X111X01110
mem[50095] = 329773464
mem[19363] = 23694
mem[23187] = 136735746
mem[41305] = 248581
mem[60810] = 36613
mask = 11X1010000000001X00001X0010010111X10
mem[23234] = 315410359
mem[61681] = 3806597
mem[57545] = 205794
mem[8173] = 743124
mem[33142] = 2265923
mem[50325] = 338694
mask = 11101XX10001X001X100101X0X11101000X0
mem[10886] = 92
mem[31621] = 49382572
mem[40094] = 381691821
mem[22404] = 25092613
mem[26046] = 540575313
mask = 1100X110000X000100X01X0X0X00X0X00001
mem[6401] = 12044
mem[51779] = 1254732
mem[49213] = 14771072
mask = 11001X1100X10X0111001110X10X0XX00100
mem[17960] = 1810
mem[58879] = 14547554
mask = 10110010X01110X01101000101100X011X01
mem[6271] = 43039
mem[42035] = 308023
mem[61809] = 14965999
mem[14482] = 22965
mask = 1000011111000X0X0110X111X1001XX00110
mem[34865] = 521885574
mem[32874] = 47758845
mem[49758] = 486116428
mem[4620] = 436
mem[8795] = 37336
mem[35355] = 1913
mem[24155] = 5028
mask = 100X00X100XXX0X011X111000001X00X1001
mem[12898] = 326718882
mem[41304] = 2217
mem[512] = 252187
mask = 00001X10X0111X0X01100010001010110011
mem[17133] = 9763003
mem[53861] = 20374202
mem[12411] = 11146
mem[44155] = 70710
mem[18558] = 1014374
mem[8244] = 27394
mask = 1100111100010X0X110X10X1X1110X100100
mem[6255] = 15673046
mem[27448] = 617665
mem[17549] = 1391
mem[9254] = 1191392
mask = 1110111X00010001X11XX110X01110100001
mem[27269] = 915739
mem[17886] = 2414578
mem[23234] = 10312308
mask = 1000111100010X01110X0101XX1010100001
mem[14210] = 3945538
mem[53570] = 152079
mem[42311] = 804
mem[20501] = 7528
mem[62486] = 44029
mask = 1X1X110X1X0X0010100001X111X11X10110X
mem[31020] = 10294
mem[36367] = 173644419
mem[3344] = 55087
mem[22404] = 3768102
mask = 0X000010000X00X01100XX1000110X001101
mem[8146] = 32084685
mem[25356] = 204754
mem[53100] = 31087
mem[16162] = 43271515
mem[7495] = 248175354
mask = 0X00111X000100000111000011000X11000X
mem[48425] = 16845
mem[21120] = 5932031
mem[18984] = 5971079
mem[22024] = 1139029
mem[57772] = 8264
mask = 1000X1X111X00000011001001X01X1000X11
mem[29416] = 214197264
mem[23107] = 16163
mem[35947] = 392
mem[3969] = 18827505
mask = 1X001111000XX10X1101110001X111100000
mem[23664] = 824737
mem[35051] = 6316
mem[23107] = 3396
mem[23133] = 93865
mask = 101000100011X000110101010110XX01010X
mem[64539] = 503222475
mem[49280] = 222415
mem[4908] = 6056
mask = X11011110001000111X000110X100X111101
mem[63002] = 227835267
mem[62736] = 2687
mem[35355] = 13135677
mem[30575] = 34622509
mem[6958] = 8289
mask = 1100111100X1X00111101011001110XXX011
mem[38931] = 50025
mem[5213] = 488636
mem[16162] = 6370
mem[49918] = 27948504
mem[10972] = 32144736
mem[25810] = 23808695
mem[59308] = 573239
mask = 1000001000X10X001100X011X01X11100X01
mem[8119] = 1356
mem[18765] = 16001283
mem[40681] = 81290249
mem[12898] = 1301
mem[26361] = 20784743
mem[27679] = 142542224
mask = 101X001X001X00001X0X0110001X111X01X1
mem[35355] = 805383617
mem[61993] = 4078154
mem[17549] = 1577966
mem[5900] = 111957340
mask = 0000001000010XX01X000000000100X10001
mem[14482] = 203210
mem[40789] = 103701945
mem[60901] = 165096
mem[9784] = 16634
mem[58840] = 2959
mask = 0X0000100001010XX1X0101X001X01X010XX
mem[35677] = 923584
mem[38170] = 52214160
mem[59710] = 917580
mem[28352] = 9711
mem[24738] = 527299
mask = 111XX100100100X0XXX0010111011010100X
mem[48324] = 113818619
mem[46099] = 22968630
mem[2047] = 7513744
mem[16084] = 22059
mem[3484] = 7934120
mask = 100001X00X01000111XX110010X1X0011X01
mem[40970] = 582049676
mem[43326] = 33149
mem[28352] = 8866951
mem[8571] = 5223
mask = X10100100XX1000011001X00100011000010
mem[57677] = 10736612
mem[44008] = 27644
mem[51849] = 54378
mem[20005] = 5582059
mem[23107] = 9832268
mem[57561] = 40400
mask = 11101111000X0001X10X10X10X1X10X010X0
mem[29968] = 89927661
mem[56] = 1989163
mem[7557] = 17453
mem[33361] = 9
mem[43444] = 78638
mem[12248] = 54497991
mem[35709] = 2765740
mask = 110XX1X00000000X0X00110000X0000001X0
mem[34491] = 13649
mem[26000] = 980
mask = 0X0000100X010100X1X0X000010001100101
mem[7504] = 2704
mem[41073] = 22655
mem[28507] = 9278213
mem[21463] = 1475
mem[63802] = 11330
mask = 11001111000X0001X100X1001001101000X0
mem[45847] = 1029083
mem[52359] = 87173
mem[7504] = 205315899
mem[37731] = 657
mem[41396] = 1027
mask = X001X0100XX10X1011X10X010000001111X1
mem[29618] = 14034335
mem[7831] = 1455
mem[28409] = 26087196
mask = X000001000010X0011001X1XX010XXX011X1
mem[49280] = 816038
mem[53410] = 632054
mem[25605] = 2170
mem[47742] = 449847
mem[7056] = 13776253
mem[12256] = 722
mask = 110X11X100010001X10010X0X01010100100
mem[63043] = 7807913
mem[57885] = 230082055
mem[50315] = 27089695
mem[64722] = 54151
mem[19735] = 978866
mem[41391] = 9015641
mem[50548] = 96572794
mask = 100X00X0XX0000X1110X10111011111000X1
mem[61760] = 5688555
mem[18595] = 4630
mem[41305] = 1670
mem[25605] = 472094
mem[50759] = 28261157
mask = 00XXX1X0010100011XX1011010X0010100XX
mem[16270] = 7874
mem[63561] = 49551173
mem[43150] = 11196
mem[18504] = 18360154
mask = 1X0101X1000000X111001X100X0011010101
mem[1825] = 2048695
mem[26563] = 66443
mem[22477] = 2539322
mem[59104] = 1269245
mem[50554] = 3370
mem[7797] = 300
mask = 1000000XX0000X11010X11111X011010X011
mem[61720] = 700175
mem[37943] = 41662
mem[3405] = 441992426
mask = X0XX0X001X00001001000111110110XX0110
mem[45473] = 1830
mem[35940] = 16393
mem[44793] = 10545068
mem[23107] = 145304756
mem[48096] = 480559528
mem[57539] = 97582237
mem[64518] = 60543
mask = 10X00100010100X1X01XX0X000010101011X
mem[14210] = 200447
mem[26703] = 46292
mem[42748] = 7946
mem[11664] = 7633363
mask = X00X010001010X01XX11X0101X0X01000X01
mem[40269] = 357709
mem[36823] = 14385170
mem[52568] = 522064310
mem[41363] = 389730
mem[4127] = 2285054
mask = 1010110010000010X000XX111011100X01XX
mem[19072] = 49597375
mem[32473] = 7622
mem[1916] = 9685106
mem[10040] = 16339629
mem[10795] = 25165351
mem[16634] = 508779
mem[16084] = 232615
mask = 11XX1111X001XX0111000010X0110100X111
mem[44372] = 11010
mem[58030] = 5106
mem[15235] = 24371
mem[41578] = 3641535
mask = 110000X000000X01X0X0X01X1X0100001011
mem[64968] = 1528
mem[21183] = 429276
mem[51816] = 60726
mem[12248] = 87748
mask = X0001111000000011100101X10111100X11X
mem[39612] = 57230
mem[33329] = 35880
mem[15681] = 27569
mem[51326] = 237622439
mem[36099] = 48369
mem[58183] = 726
mem[38471] = 2690
mask = 11X011110X01000X0100X0X0X000X01X01X0
mem[41793] = 519002787
mem[39290] = 5821
mask = 000X00100001XX00X1000000X1XX10010110
mem[36367] = 1347261
mem[52040] = 858329
mem[60969] = 14183
mem[49232] = 3014091
mask = X000X01X000101XX1100X11001X00000100X
mem[61397] = 9063
mem[63395] = 92917
mem[47750] = 6587
mem[13695] = 2038
mem[52876] = 219355
mem[50726] = 815351
mask = 11X0X111000100011100100X0X11X1X011XX
mem[24438] = 360143
mem[14268] = 233280
mem[46071] = 14590
mem[47430] = 195019
mem[8714] = 5003481
mem[34758] = 866985
mask = 10000X00XX010101101X1X111001X0001110
mem[12826] = 369283
mem[33546] = 519165
mem[34578] = 12340
mem[13504] = 301264250
mem[4433] = 26315015
mask = X0X011X000X100X001110100000XX011100X
mem[10779] = 6427
mem[62591] = 124867728
mem[4073] = 26086825
mem[19735] = 14280934
mem[40681] = 54398576
mem[44232] = 1164302
mem[5734] = 677248729
mask = 1000XX0X11000010X100X01011011X1001X1
mem[55680] = 6971988
mem[4565] = 1361280
mem[35316] = 2209
mem[40546] = 758
mem[47381] = 49216
mask = 000000100XX10101X10X10000XX1X01X0100
mem[57507] = 477326
mem[58729] = 256151738
mem[47689] = 16875625
mask = 0000001000010X00X100100X0X0X0X00010X
mem[58893] = 531598
mem[56609] = 1534
mem[793] = 3558686
mem[17811] = 31042
mem[41552] = 73028105
mem[12657] = 1035597401
mask = 110011100000000101001XX00101X0000X00
mem[18971] = 81961737
mem[58641] = 685839
mem[58774] = 51830284
mem[50554] = 190835154
mask = 1010X100000000101X00100X1110X0001X01
mem[10630] = 11281616
mem[30301] = 344
mem[21809] = 66389352
mem[15829] = 3924744
mem[50602] = 546681
mem[33142] = 153438
mask = 0X000010000X010X111X01X11110111X10X0
mem[32309] = 1315
mem[59481] = 404
mem[13793] = 2029
mem[41406] = 2393
mem[7495] = 24826836
mem[61576] = 9555003
mask = 00000100X10X010111111X0010X111010010
mem[6662] = 15689063
mem[1130] = 182923358
mem[6648] = 3538
mem[8833] = 7984
mem[7495] = 8285851
mask = 11000X1X00XX000100X01X0X01X11X000000
mem[34270] = 180307825
mem[36097] = 712
mem[47750] = 843753
mem[44800] = 247708
mem[48331] = 31912
mask = 0001000001010101XX1X1X1X011X1000011X
mem[15235] = 491
mem[47685] = 775
mem[52882] = 99948
mem[32016] = 395727
mask = 100000010XX0XX00X101X10000X110X01000
mem[49801] = 230387797
mem[55855] = 7808
mem[39291] = 114525
mem[50759] = 2588
mem[31793] = 19374
mask = 10XX11X000010X00X1X1XX010011011110X1
mem[45068] = 763282
mem[31165] = 43188
mem[25684] = 1041033
mem[52456] = 32196
mask = 1100X1XXX001X00111X0110X0X101010X101
mem[59821] = 6610
mem[57397] = 67932
mem[15240] = 505977952
mask = 100X001XX0X1X00011010100X0110000X001
mem[22585] = 2024050
mem[30527] = 79580709
mem[57425] = 7597579
mem[49280] = 47528262
mask = 1X00XX1X000X0001110011X010X111000001
mem[45847] = 207968
mem[12898] = 69230005
mem[18887] = 433691609
mem[7495] = 114085080
mem[8177] = 105183315
mem[9561] = 1468259
mem[38679] = 7998
"""
