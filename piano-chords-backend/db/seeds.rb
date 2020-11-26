# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
major = Chord.create(name: "Major Triad", symbols: "M, ", structure: "0, 4, 7")
minor = Chord.create(name: "Minor Triad", symbols: "m, -", structure: "0, 3, 7")
dim = Chord.create(name: "Diminished Triad", symbols: "mb5, o", structure: "0, 3, 6")
aug = Chord.create(name: "Augmented Triad", symbols: "#5, +", structure: "0, 4, 8")

maj7 = Chord.create(name: "Major Seven", symbols: "M7, Δ7", structure: "0, 4, 7, 11")
min7 = Chord.create(name: "Minor Seven", symbols: "m7, -7", structure: "0, 3, 7, 10")
half_dim = Chord.create(name:"Half Diminished Seven", symbols: "ø7, m7b5", structure: "0, 3, 6, 10")
whole_dim = Chord.create(name:"Diminished Seven", symbols: "o7", structure: "0, 3, 6, 9")

maj9 = Chord.create(name: "Major Nine", symbols: "M9, Δ9", structure: "0, 4, 7, 11, 14")