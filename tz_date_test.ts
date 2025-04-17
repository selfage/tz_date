import { TzDate } from "./tz_date";
import { assertThat, eq } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";

TEST_RUNNER.run({
  name: "TzDateTest",
  cases: [
    {
      name: "ConvertTimestampStringWrtTimezoneAndToStringsAndTimestamps",
      execute() {
        // Execute
        let date = TzDate.fromTimestampString("2024-01-01T08:31:20.112Z", 8);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "today");
        assertThat(date.toMonthISOString(), eq("2024-01"), "month");
        assertThat(
          date.toUtcISOString(),
          eq("2024-01-01T08:00:00.000Z"),
          "utc today",
        );
        assertThat(
          date.toLocalISOString(),
          eq("2024-01-01T00:00:00.000-08"),
          "local today",
        );
        assertThat(
          date.toTimestampMs(),
          eq(new Date("2024-01-01T08:00:00Z").valueOf()),
          "timestamp today",
        );

        // Execute
        date = TzDate.fromTimestampString("2024-01-01T07:33:53.984Z", 8);

        // Verify
        assertThat(date.toDateISOString(), eq("2023-12-31"), "prev day");
        assertThat(date.toMonthISOString(), eq("2023-12"), "prev month");
        assertThat(
          date.toUtcISOString(),
          eq("2023-12-31T08:00:00.000Z"),
          "utc prev day",
        );
        assertThat(
          date.toLocalISOString(),
          eq("2023-12-31T00:00:00.000-08"),
          "local prev day",
        );
        assertThat(
          date.toTimestampMs(),
          eq(new Date("2023-12-31T08:00:00Z").valueOf()),
          "timestamp prev day",
        );
      },
    },
    {
      name: "ConvertTimestampWrtTimezone",
      execute() {
        // Execute
        let date = TzDate.fromTimestampMs(
          new Date("2024-01-01T08:31:22.132Z").valueOf(),
          8,
        );

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "today");

        // Execute
        date = TzDate.fromTimestampMs(
          new Date("2024-01-01T07:01:00.122Z").valueOf(),
          8,
        );

        // Verify
        assertThat(date.toDateISOString(), eq("2023-12-31"), "prev day");
      },
    },
    {
      name: "ConvertDatetimeWrtTimezone",
      execute() {
        // Execute
        let date = TzDate.fromDate(new Date("2024-01-01T08:00:00Z"), 8);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "today");

        // Execute
        date = TzDate.fromDate(new Date("2024-01-01T07:00:00Z"), 8);

        // Verify
        assertThat(date.toDateISOString(), eq("2023-12-31"), "prev day");
      },
    },
    {
      name: "FromLocalDateString",
      execute() {
        // Execute
        let date = TzDate.fromLocalDateString("2024-01-01", 8);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "today");

        // Execute
        date = TzDate.fromLocalDateString("2024-01", 8);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "first day of month");
        assertThat(date.toMonthISOString(), eq("2024-01"), "month");
      },
    },
    {
      name: "MoveDates",
      execute() {
        // Prepare
        let date = TzDate.fromLocalDateString("2024-01-01", 8);

        // Execute
        date.addDays(-1);

        // Verify
        assertThat(date.toDateISOString(), eq("2023-12-31"), "-1 day");

        // Execute
        date.addDays(1);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "+1 day");

        // Execute
        date.addMonths(-1);

        // Verify
        assertThat(date.toDateISOString(), eq("2023-12-01"), "-1 month");

        // Execute
        date.addMonths(1);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "+1 month");

        // Execute
        date.addYears(-1);

        // Verify
        assertThat(date.toDateISOString(), eq("2023-01-01"), "-1 year");

        // Execute
        date.addYears(1);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "+1 year");

        // Execute
        date.moveToLastDayOfMonth();

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-31"), "last day of month");

        // Execute
        // Adding month to the last day of a month is an edge case that's hard to handle correctly. Always move to the first day of the month first.
        date.moveToFirstDayOfMonth();
        date.addMonths(1);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-02-01"), "first day of +1 month");
      },
    },
    {
      name: "Clone_Differences",
      execute() {
        // Prepare
        let date = TzDate.fromLocalDateString("2024-01-01", 8);

        // Execute
        let date2 = date.clone().addMonths(3);

        // Verify
        assertThat(date.toDateISOString(), eq("2024-01-01"), "date");
        assertThat(date2.toDateISOString(), eq("2024-04-01"), "date2");

        // Execute
        let months = date2.minusDateInMonths(date);

        // Verify
        assertThat(months, eq(3), "months");

        // Execute
        let days = date2.minusDateInDays(date);

        // Verify
        assertThat(days, eq(91), "days");
      }
    }
  ],
});
