class BaseDto {
  id = "";
  constructor(data: any) {
    if (!data) return;

    this.id = data.id;
  }
}

export { BaseDto };
