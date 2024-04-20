package main

import (
	"bufio"
	"database/sql/driver"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type values []string

func (e *values) Scan(src interface{}) error {
	return json.Unmarshal(src.([]byte), &e)
}

func (e values) Value() (driver.Value, error) {
	val, err := json.Marshal(e)
	return string(val), err
}

type Vacancy struct {
	gorm.Model

	GenericGroup    string
	ExperienceLevel string
	Name            string
	Requirements    values
	Knowledge       values
	Abilities       values
	ExtraExperience values
}

const filename = "vacancies.csv"

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

	if err := db.AutoMigrate(&Vacancy{}); err != nil {
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
			log.Fatalf("Error in add_to_db. err = %q offset = %d\n", err, csvReader.InputOffset())
		}
	}
}

func add_to_db(record []string, db *gorm.DB) error {
	entry := new(Vacancy)

	entry.GenericGroup = record[0]
	if record[1] == "" || strings.ToLower(record[1]) == "нет" {
		entry.ExperienceLevel = "Нет опыта"
	} else {
		entry.ExperienceLevel = record[1]
	}
	entry.Name = record[3]
	if record[4] != "" {
		if err := json.Unmarshal([]byte(record[4]), &entry.Requirements); err != nil {
			return err
		}
	} else {
		entry.Requirements = []string{}
	}
	if record[5] != "" {
		if err := json.Unmarshal([]byte(record[5]), &entry.Knowledge); err != nil {
			return err
		}
	} else {
		entry.Knowledge = []string{}
	}
	if record[6] != "" {
		if err := json.Unmarshal([]byte(record[6]), &entry.Abilities); err != nil {
			return err
		}
	} else {
		entry.Abilities = []string{}
	}
	if record[7] != "" {
		if err := json.Unmarshal([]byte(record[7]), &entry.ExtraExperience); err != nil {
			return err
		}
	} else {
		entry.ExtraExperience = []string{}
	}

	db.Create(entry)
	fmt.Printf("+ %v\n", entry.Name)

	return nil
}
