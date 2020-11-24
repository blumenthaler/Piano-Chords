# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
major = Chord.create(name: "Major Triad", symbols: "CM, C", structure: "4, 3")
minor = Chord.create(name: "Minor Triad", symbols: "Cm, C-", structure: "3, 4")
dim = Chord.create(name: "Diminished Triad", symbols: "Cmb5, Co", structure: "3, 3")
aug = Chord.create(name: "Augmented Triad", symbols: "C#5, C+", structure: "4, 4")