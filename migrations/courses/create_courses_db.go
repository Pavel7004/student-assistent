package main

import (
	"bufio"
	"database/sql/driver"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const filename = "courses_acceptance.csv"

type Exam struct {
	Name     string
	MinScore uint32
}

type Exams []Exam

func (e *Exams) Scan(src interface{}) error {
	return json.Unmarshal(src.([]byte), &e)
}

func (e Exams) Value() (driver.Value, error) {
	val, err := json.Marshal(e)
	return string(val), err
}

type Acceptance struct {
	Budget   uint32
	Contract uint32
}

type Competition struct {
	Budget   float64
	Contract float64
}

type Course struct {
	gorm.Model

	Code          string
	Name          string
	Group         string
	Acceptance    Acceptance `gorm:"embedded;embeddedPrefix:acceptance_"`
	PriceContract uint64
	Exams         Exams `gorm:"type:json"`
	TotalScore    uint32
	Competition   Competition `gorm:"embedded;embeddedPrefix:competition_"`
}

func main() {
	f, err := os.Open(filename)
	if err != nil {
		log.Fatalf("Failed to open file %s. err = %q\n", filename, err)
	}
	defer f.Close()

	dsn := "user=test password=test dbname=student_courses host=localhost port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	if err := db.AutoMigrate(&Course{}); err != nil {
		log.Fatal(err)
	}

	read_csv(f, db)
}

func read_csv(f *os.File, db *gorm.DB) {
	buff := bufio.NewReader(f)
	csvReader := csv.NewReader(buff)

	if _, err := csvReader.Read(); err == io.EOF {
		return
	}
	for {
		record, err := csvReader.Read()
		if err != nil {
			if err == io.EOF {
				break
			}
			log.Fatalf("Failed to parse csv. err = %q\n", err)
		}

		if err := add_to_db(record, db); err != nil {
			log.Fatal(err)
		}
	}
}

func add_to_db(record []string, db *gorm.DB) error {
	entry := new(Course)

	if code, name, ok := strings.Cut(record[0], " "); ok {
		entry.Code, entry.Name = code, name
	} else {
		return errors.New("Wrong course name")
	}

	entry.Group = record[1]

	budget, err := strconv.ParseUint(record[2], 10, 32)
	if err != nil {
		return err
	}
	entry.Acceptance.Budget = uint32(budget)

	contract, err := strconv.ParseUint(record[3], 10, 32)
	if err != nil {
		return err
	}
	entry.Acceptance.Contract = uint32(contract)

	price, err := strconv.ParseUint(record[4], 10, 32)
	if err != nil {
		return err
	}
	entry.PriceContract = price

	score1, err := strconv.ParseUint(record[8], 10, 32)
	if err != nil {
		return err
	}
	score2, err := strconv.ParseUint(record[9], 10, 32)
	if err != nil {
		return err
	}
	score3, err := strconv.ParseUint(record[10], 10, 32)
	if err != nil {
		return err
	}
	entry.Exams = Exams{
		Exam{
			Name:     record[5],
			MinScore: uint32(score1),
		},
		Exam{
			Name:     record[6],
			MinScore: uint32(score2),
		},
		Exam{
			Name:     record[7],
			MinScore: uint32(score3),
		},
	}

	total, err := strconv.ParseUint(record[11], 10, 32)
	if err != nil {
		return err
	}
	entry.TotalScore = uint32(total)

	cbudget, err := strconv.ParseFloat(record[12], 64)
	if err != nil {
		return err
	}
	entry.Competition.Budget = cbudget

	ccontract, err := strconv.ParseFloat(record[13], 64)
	if err != nil {
		return err
	}
	entry.Competition.Contract = ccontract

	db.Create(entry)
	fmt.Printf("Added entry %v\n", entry.Name)

	return nil
}
