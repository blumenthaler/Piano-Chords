# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
major = Chord.create(name: "Major Triad", symbols: "M, ", structure: "4, 3")
minor = Chord.create(name: "Minor Triad", symbols: "m, -", structure: "3, 4")
dim = Chord.create(name: "Diminished Triad", symbols: "mb5, o", structure: "3, 3")
aug = Chord.create(name: "Augmented Triad", symbols: "#5, +", structure: "4, 4")

maj7 = Chord.create(name: "Major Seven", symbols: "M7, Δ7", structure: "4, 3, 4")
min7 = Chord.create(name: "Minor Seven", symbols: "m7, -7", structure: "3, 4, 3")
half_dim = Chord.create(name:"Half Diminished Seven", symbols: "ø7, m7b5", structure: "3, 3, 4")
whole_dim = Chord.create(name:"Diminished Seven", symbols: "o7", structure: "3, 3, 3")

maj9 = Chord.create(name: "Major Nine", symbols: "M9, Δ9", structure: "4, 3, 4, 3")