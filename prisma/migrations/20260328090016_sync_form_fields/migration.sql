-- AlterTable
ALTER TABLE `Penelitian` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `jadwalPelaksanaan` TEXT NULL,
    ADD COLUMN `nama` VARCHAR(191) NULL,
    ADD COLUMN `namaDosenPembimbing` VARCHAR(191) NULL,
    ADD COLUMN `namaInstitusi` VARCHAR(191) NULL,
    ADD COLUMN `nim` VARCHAR(191) NULL,
    ADD COLUMN `noWa` VARCHAR(191) NULL,
    ADD COLUMN `suratPermohonanUrl` VARCHAR(191) NULL;
