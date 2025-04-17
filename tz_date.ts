// Internal Date representation is set in UTC timezone. Currently only supports negative timezone offset. E.g. UTC-8
export class TzDate {
  public static fromDate(localDate: Date, negativeOffset: number): TzDate {
    if (localDate.getUTCHours() < negativeOffset) {
      localDate.setUTCDate(localDate.getUTCDate() - 1);
    }
    return new TzDate(localDate, negativeOffset);
  }

  public static fromTimestampMs(
    timestampMs: number,
    negativeOffset: number,
  ): TzDate {
    return TzDate.fromDate(new Date(timestampMs), negativeOffset);
  }

  public static fromTimestampString(
    timestampISOString: string, // yyyy-MM-ddTHH:mm:ssZ
    negativeOffset: number,
  ): TzDate {
    return TzDate.fromDate(new Date(timestampISOString), negativeOffset);
  }

  // Means there is no need to convert wrt timezone.
  public static fromLocalDateString(
    localDateISOString: string, // yyyy-MM-dd or yyyy-MM
    negativeOffset: number,
  ): TzDate {
    let date = new Date(localDateISOString);
    return new TzDate(date, negativeOffset);
  }

  public constructor(
    private dateUtc: Date,
    private negativeOffset: number,
  ) {
    dateUtc.setUTCHours(0);
    dateUtc.setUTCMinutes(0);
    dateUtc.setUTCSeconds(0);
    dateUtc.setUTCMilliseconds(0);
  }

  public clone(): TzDate {
    return new TzDate(new Date(this.dateUtc), this.negativeOffset);
  }

  public addDays(days: number): TzDate {
    this.dateUtc.setUTCDate(this.dateUtc.getUTCDate() + days);
    return this;
  }

  public addMonths(months: number): TzDate {
    this.dateUtc.setUTCMonth(this.dateUtc.getUTCMonth() + months);
    return this;
  }

  public addYears(years: number): TzDate {
    this.dateUtc.setUTCFullYear(this.dateUtc.getUTCFullYear() + years);
    return this;
  }

  public minusDateInMonths(date: TzDate): number {
    return (
      (this.dateUtc.getUTCFullYear() - date.dateUtc.getUTCFullYear()) * 12 +
      this.dateUtc.getUTCMonth() -
      date.dateUtc.getUTCMonth()
    );
  }

  public minusDateInDays(date: TzDate): number {
    return (
      (this.dateUtc.getTime() - date.dateUtc.getTime()) / (1000 * 3600 * 24)
    );
  }

  public moveToFirstDayOfMonth(): TzDate {
    this.dateUtc.setUTCDate(1);
    return this;
  }

  public moveToLastDayOfMonth(): TzDate {
    this.dateUtc.setUTCMonth(this.dateUtc.getUTCMonth() + 1);
    this.dateUtc.setUTCDate(0);
    return this;
  }

  public toDateISOString(): string {
    let year = this.dateUtc.getUTCFullYear().toString().padStart(4, "0");
    let month = (this.dateUtc.getUTCMonth() + 1).toString().padStart(2, "0");
    let day = this.dateUtc.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  public toMonthISOString(): string {
    let year = this.dateUtc.getUTCFullYear().toString().padStart(4, "0");
    let month = (this.dateUtc.getUTCMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  }

  public toUtcISOString(): string {
    let hour = this.negativeOffset.toString().padStart(2, "0");
    return `${this.toDateISOString()}T${hour}:00:00.000Z`;
  }

  public toLocalISOString(): string {
    let hour = this.negativeOffset.toString().padStart(2, "0");
    return `${this.toDateISOString()}T00:00:00.000-${hour}`;
  }

  public toTimestampMs(): number {
    return this.dateUtc.getTime() + this.negativeOffset * 60 * 60 * 1000;
  }
}
