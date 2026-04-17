-- Add optional image URL for Read & Watch announcements/resources
ALTER TABLE `ReadWatch`
ADD COLUMN `imageUrl` VARCHAR(191) NULL;
