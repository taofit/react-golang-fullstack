package seed

import (
	"log"
	"os"
	"os/exec"
)

func RunSeeder() {
	if os.Getenv("RUN_SEEDER") == "true" {
		log.Println("RUN_SEEDER=true detected. Running seeder...")
		var cmd *exec.Cmd

		if _, err := os.Stat("./seeder"); err == nil {
			log.Println("Found compiled seeder binary, executing...")
			cmd = exec.Command("./seeder")
		} else {
			log.Println("Seeder binary not found, Running with 'go run'(Local dev mode)... ")
			cmd = exec.Command("go", "run", "./cmd/populate-igdb/main.go")
		}
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			log.Printf("Seeder failed: %v", err)
		} else {
			log.Println(">>> Seeding completed successfully")
		}
	} else {
		log.Println("RUN_SEEDER=false detected. Skipping seeder...")
	}
}
